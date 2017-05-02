import fs = require('fs');
import {FirebaseProjectConfig} from './project-config';
import {FirebaseEnvironment} from './firebase-env';
import {JSON_FILE_WRITE_CONFIG} from './constants';

const jsonFile = require('jsonfile');
const firebaseAdmin = require('firebase-admin');


let firebaseInitialized: boolean = false
/**
 *
 */
export class RemoteProjectUtil {


  static pushAuthenticationUsersFromUsersFile(env: FirebaseEnvironment): Promise<boolean> {
    const promises: Promise<void>[] = []
    const auth = RemoteProjectUtil.getApp(env).auth()
    env.projectUsers.forEach((user: any) => {
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

  static pushDatabase(env: FirebaseEnvironment, force: boolean = false): Promise<boolean> {
    const db = RemoteProjectUtil.getApp(env).database()

    return new Promise<boolean>((resolve, reject) => {
      const ref = db.ref('/');
      let data: string = env.databaseTemplateData
      ref.once('value', (snapshot: any) => {
        if (snapshot.exists()) {
          if (force) {
            console.log('Database already populated. Taking backup and forcing overwrite.')
            resolve(env.takeBackup().then(() => RemoteProjectUtil.overwriteDatabaseWithTemplate(env)))
          } else {
            console.log('Database already populated.')
            db.goOffline()
            resolve(false)
          }
        } else {

          ref.set(data, (error: any) => {
            if (error) {
              this.logError(data, error)
              reject(error)
            } else {
              console.log(`   pushed data to remote Firebase project.`)
            }
            db.goOffline()
            resolve(true)
          })
        }
      }, (error: any) => {
        this.logError(data, error)
        db.goOffline()
        reject(error)
      })
    });
  }

  static overwriteDatabaseWithTemplate(env: FirebaseEnvironment): Promise<boolean> {
    const db = RemoteProjectUtil.getApp(env).database()

    return new Promise<boolean>((resolve, reject) => {
      const ref = db.ref('/');
      let data: FirebaseProjectConfig
      data = jsonFile.readFileSync(env.databaseTemplateData)
      ref.set(data, (error: any) => {
        if (error) {
          this.logError(data, error)
          reject(error)
        } else {
          console.log(`   pushed data to remote Firebase project.`)
        }
        db.goOffline()
        resolve(true)
      }, (error: any) => {
        this.logError(data, error)
        db.goOffline()
        reject(error)
      })
    });
  }


  static logError(authData, error) {
    console.error('Error pushing default data firebase.')
    console.error('Using auth:', JSON.stringify(authData))
    console.error('Native error: ', error)
  }

  static  getApp(env: FirebaseEnvironment) {
    if (!firebaseInitialized) {
      firebaseAdmin.initializeApp({
        credential: firebaseAdmin.credential.cert(env.accountCertKeyFilePath),
        databaseURL: 'https://' + env.projectId + '.firebaseio.com',
        databaseAuthVariableOverride: {
          uid: 'gulp-service-worker'
        }
      });
      firebaseInitialized = true
    }
    return firebaseAdmin
  }

  static backupDatabase(env: FirebaseEnvironment, backupDirPath: string): Promise<boolean> {
    const db = RemoteProjectUtil.getApp(env).database()
    db.goOnline()
    return new Promise((resolve, reject) => {
      const ref = db.ref('/');
      console.log(`Requesting data from server: https://${env.projectId}.firebaseio.com`)
      ref.on('value', (snapshot: any) => {
        if (snapshot.exists()) {
          if (!fs.existsSync(backupDirPath)) {
            fs.mkdirSync(backupDirPath);
          }
          let path = `${backupDirPath}/full_${Date.now()}.json`
          console.log(`Database is populated. Writing data to ${path}`)
          jsonFile.writeFileSync(path, snapshot.val(), JSON_FILE_WRITE_CONFIG)
          resolve(true)
        }
        else {
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




