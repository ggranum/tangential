import fs = require('fs');
import {FirebaseEnvironment} from '../project/model/firebase/firebase-environement';
import {JSON_FILE_WRITE_CONFIG} from '../constants';
import {Project} from '../project/model/project';

const jsonFile = require('jsonfile');
const firebaseAdmin = require('firebase-admin');


let firebaseInitialized: boolean = false

/**
 *
 */
export class RemoteProjectUtil {


  static pushAuthenticationUsersFromUsersFile(project: Project, fbEnv: FirebaseEnvironment): Promise<boolean> {
    const promises: Promise<void>[] = []
    const auth = RemoteProjectUtil.getApp(fbEnv).auth()
    project.currentEnvironment().projectUsers.forEach((user: any) => {
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
    const db = RemoteProjectUtil.getApp(fbEnv).database()
    return new Promise<boolean>((resolve, reject) => {
      const ref = db.ref('/');
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
        console.log('RemoteProjectUtil', "Error pushing data. Maybe double check your cert? " +
          "Or perhaps you have a Firebase Rule that is preventing the push?")
        this.logError(data, error)

        db.goOffline()
        reject(error)
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
    console.error('Error pushing default data firebase.')
    console.error('Using auth:', JSON.stringify(authData))
    console.error('Native error: ', error)
  }

  static getApp(fbEnv: FirebaseEnvironment) {
    if (!firebaseInitialized) {
      firebaseAdmin.initializeApp({
        credential: firebaseAdmin.credential.cert(fbEnv.getPrivateKeyPath()),
        databaseURL: 'https://' + fbEnv.config.projectId + '.firebaseio.com',
        databaseAuthVariableOverride: {
          uid: 'gulp-service-worker'
        }
      });
      firebaseInitialized = true
    }
    return firebaseAdmin
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
          let backupPath = `${backupDirPath}/full_${Date.now()}.json`
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




