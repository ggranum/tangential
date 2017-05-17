import fs = require('fs');
import {FirebaseEnvironment} from '../model/firebase/firebase-environement';
import {JSON_FILE_WRITE_CONFIG} from '../../constants';
import {Project} from '../model/project';
import {ProjectEnvironment} from '../model/project-environment';

const jsonFile = require('jsonfile');

import * as admin from 'firebase-admin'


let firebaseInitialized: boolean = false

/**
 *
 */
export class RemoteProjectUtil {


  static pushAuthenticationUsersFromUsersFile(projectEnv: ProjectEnvironment, fbEnv: FirebaseEnvironment): Promise<boolean> {
    const promises: Promise<void>[] = []
    const auth = RemoteProjectUtil.getApp(fbEnv).auth()

    projectEnv.projectUsers.forEach((user: any) => {
      if (user.uid) {
        const promise: Promise<void> = new Promise<void>((resolve, reject) => {
          auth.getUser(user.uid).then(() => {
            auth.updateUser(user.uid, user).then(() => resolve()).catch((e: any) => {
              console.log('Error updating user: ', e)
              reject(e)
            })
          }).catch((e: any) => {
            // doesn't exist yet.
            auth.createUser(user).then(() => resolve()).catch((error: any) => {
              console.log('Error creating user: ', error)
              reject(e)
            })
          })
        })
        promises.push(promise)
      }
    })
    return Promise.all(promises).then(() => true)
  }

  static pushDatabase(project: Project, fbEnv: FirebaseEnvironment, force: boolean = false): Promise<boolean> {
    const db:admin.database.Database = RemoteProjectUtil.getDb(fbEnv)
    return new Promise<boolean>((resolve, reject) => {
      const ref:firebase.database.Reference = db.ref('/');
      let data: string = fbEnv.readDatabaseTemplate()

      ref.once('value', (snapshot: any) => {
        if (snapshot.exists()) {
          if (force) {
            console.log('Database already populated. Taking backup and forcing overwrite.')
            fbEnv.takeBackupFromRemote(project.getBasePath()).then(() => {
              RemoteProjectUtil.overwriteDatabaseWithTemplate(fbEnv).then(() => {
                db.goOffline()
                resolve(true)
              })
            })
          } else {
            console.log('Database already populated, aborting. To force re-initialization use the --force option.')
            db.goOffline()
            resolve(false)
          }
        } else {
          console.log('Database is empty. Initializing...')
          ref.set(data, (error: any) => {
            if (error) {
              this.logError(data, error)
              reject(error)
            } else {
              console.log(`   pushed data to remote Firebase project.`)
              resolve(true)
            }
            db.goOffline()
          })
        }
      }, (error: any) => {
        this.logError(data, error)
        db.goOffline()
        reject(error)
      }).catch(e =>{
        console.log('RemoteProjectUtil', 'what the hell')
      })
    });
  }

  static overwriteDatabaseWithTemplate(fbEnv: FirebaseEnvironment): Promise<boolean> {
    const db = RemoteProjectUtil.getApp(fbEnv).database()
    return new Promise<boolean>((resolve, reject) => {
      let data = fbEnv.readDatabaseTemplate()
      console.log('Attempting to initialize database: ')
      db.goOnline()
      db.ref('/').set(data, (error: any) => {
        if (error) {
          this.logError(data, error)
          reject(error)
        } else {
          console.log(`   pushed data to remote Firebase project.`)
          resolve(true)
        }
      })
    });

  }


  static logError(authData, error) {
    console.error('Error executing remote firebase operation:')
    console.error('Using auth:', JSON.stringify(authData))
    console.error('Native error: ', error)
  }

  static getApp(fbEnv: FirebaseEnvironment) {
    if (!firebaseInitialized) {
      let cfg = {
        credential: admin.credential.cert(fbEnv.getPrivateKeyPath()),
        databaseURL: 'https://' + fbEnv.config.projectId + '.firebaseio.com',
        databaseAuthVariableOverride: {
          uid: 'gulp-service-worker'
        }
      }
      admin.initializeApp(cfg);
      firebaseInitialized = true
      console.log('=debug=', `Firebase Remote Operation: Using ${cfg.databaseURL}`)
    }
    return admin
  }

  static getDb(fbEnv: FirebaseEnvironment):admin.database.Database {
    return this.getApp(fbEnv).database()
  }

  static backupDatabase(fbEnv: FirebaseEnvironment, backupDirPath: string): Promise<boolean> {
    const db = RemoteProjectUtil.getApp(fbEnv).database()
    db.goOnline()
    return new Promise((resolve, reject) => {
      const ref = db.ref('/');
      console.log(`Requesting data from server: https://${fbEnv.config.projectId}.firebaseio.com`)
      ref.once('value', (snapshot: any) => {
        if (snapshot.exists()) {
          if (!fs.existsSync(backupDirPath)) {
            fs.mkdirSync(backupDirPath);
          }
          let backupPath = `${backupDirPath}/${fbEnv.config.projectId}-full_${Date.now()}.json`
          console.log(`Database is populated. Backing up data to ${backupPath}`)
          jsonFile.writeFileSync(backupPath, snapshot.val(), JSON_FILE_WRITE_CONFIG)
          resolve(true)
        } else {
          resolve(false)
        }
        db.goOffline()
      }, (e) => {
        console.log('RemoteProjectUtil', 'Error', e)
        reject(e)
        db.goOffline()
      })
    })
  }
}




