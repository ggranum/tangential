import * as fs from 'fs'
import {FirebaseApp} from '@firebase/app'

import {Database, DatabaseReference} from '@firebase/database'
import * as admin from 'firebase-admin'
import {getAuth} from 'firebase-admin/auth'
import {initializeApp} from 'firebase/app';
import {DataSnapshot, get, getDatabase, goOffline, goOnline, ref, set} from 'firebase/database'
import {JSON_FILE_WRITE_CONFIG} from '../../constants';
import {FirebaseEnvironment} from '../model/firebase/firebase-environement';
import {Project} from '../model/project';
import {ProjectEnvironment} from '../model/project-environment';

const jsonFile = require('jsonfile');


let firebaseInitialized: boolean = false

/**
 *
 */
export class RemoteProjectUtil {


  static pushAuthenticationUsersFromUsersFile(projectEnv: ProjectEnvironment, fbEnv: FirebaseEnvironment): Promise<boolean> {
    const promises: Promise<void>[] = []
    const auth = getAuth(RemoteProjectUtil.getApp(fbEnv))

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
    const db: Database = RemoteProjectUtil.getDb(fbEnv)
    return new Promise<boolean>((resolve, reject) => {
      const dbRef:DatabaseReference = ref(db, '/');
      let data: string = fbEnv.readDatabaseTemplate()


      get(ref(db, '/')).then((snapshot: DataSnapshot) => {
        if (snapshot.exists()) {
          if (force) {
            console.log('Database already populated. Taking backup and forcing overwrite.')
            fbEnv.takeBackupFromRemote(project.getBasePath()).then(() => {
              RemoteProjectUtil.overwriteDatabaseWithTemplate(fbEnv).then(() => {
                goOffline(db)
                resolve(true)
              })
            })
          } else {
            console.log('Database already populated, aborting. To force re-initialization use the --force option.')
            goOffline(db)
            resolve(false)
          }
        } else {
          console.log('Database is empty. Initializing...')
          set(dbRef, data).catch((error: any) => {
            if (error) {
              this.logError(data, error)
              reject(error)
            } else {
              console.log(`   pushed data to remote Firebase project.`)
              resolve(true)
            }
            goOffline(db)
          })
        }
      }, (error: any) => {
        this.logError(data, error)
        goOffline(db)
        reject(error)
      }).catch(e => {
        console.log('RemoteProjectUtil', e)
      })
    });
  }

  static overwriteDatabaseWithTemplate(fbEnv: FirebaseEnvironment): Promise<boolean> {
    const db = getDatabase(RemoteProjectUtil.getApp(fbEnv))
    return new Promise<boolean>((resolve, reject) => {
      let data = fbEnv.readDatabaseTemplate()
      console.log('Attempting to initialize database: ')
      goOnline(db)
      set(ref(db, '/'), data).then(() =>{}, (error: any) => {
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
  static app:FirebaseApp
  static getApp(fbEnv: FirebaseEnvironment):FirebaseApp {
    if (!firebaseInitialized) {
      let cfg = {
        credential: admin.credential.cert(fbEnv.getPrivateKeyPath()),
        databaseURL: 'https://' + fbEnv.config.projectId + '.firebaseio.com',
        databaseAuthVariableOverride: {
          uid: 'gulp-service-worker'
        }
      }
      RemoteProjectUtil.app = initializeApp(cfg);
      firebaseInitialized = true
      console.log('=debug=', `Firebase Remote Operation: Using ${cfg.databaseURL}`)
    }
    return RemoteProjectUtil.app
  }

  static getDb(fbEnv: FirebaseEnvironment):Database {
    return getDatabase(this.getApp(fbEnv));
  }

  static backupDatabase(fbEnv: FirebaseEnvironment, backupDirPath: string): Promise<boolean> {
    const db = getDatabase(RemoteProjectUtil.getApp(fbEnv))
    goOnline(db)
    return new Promise((resolve, reject) => {
      const aRef = ref(db, '/');
      console.log(`Requesting data from server: https://${fbEnv.config.projectId}.firebaseio.com`)
      get(aRef).then( (snap: DataSnapshot) => {
        if (snap.exists()) {
          if (!fs.existsSync(backupDirPath)) {
            fs.mkdirSync(backupDirPath);
          }
          let backupPath = `${backupDirPath}/${fbEnv.config.projectId}-full_${Date.now()}.json`
          console.log(`Database is populated. Backing up data to ${backupPath}`)
          jsonFile.writeFileSync(backupPath, snap.val(), JSON_FILE_WRITE_CONFIG)
          resolve(true)
        } else {
          resolve(false)
        }
        goOffline(db)
      }, (e) => {
        console.log('RemoteProjectUtil', 'Error', e)
        reject(e)
        goOffline(db)
      })
    })
  }
}




