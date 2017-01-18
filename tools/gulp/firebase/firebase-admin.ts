///<reference path="../../../node_modules/firebase-admin/lib/index.d.ts"/>
/**
 * Firebase does not allow for pulling down all your database user UID's easily. Nor do they work to make it clear
 * WHY they left this obvious feature out of their API. There are claims around the internet about security, but
 * they don't link to their reasoning in the API, which is super confusing.
 *
 * SO, anyway, to get a list of Users from your DB you will need to visit the admin console at firebaseAdmin.google.com.
 *
 * The steps to extract a list of usable UID values:
 *
 * 1) Navigate to your app in the firebaseAdmin.google.com console - e.g.
 *      https://console.firebaseAdmin.google.com/project/{your-project}/authentication/users
 * 2) Change the 'Rows per page' at the bottom of the table to 250 / Max
 * 3) Inspect (using dev tools) the header of the table. In the inspection window, find the html element:
 *      <md-card md-cell="12" class="a12n-users-wrapper _md md-gmp-blue-theme"> ....
 * 4) In 'styles' for the element, update the max-width value to a larger number - e.g 1500. This should make the table
 *      wide enough to display the full UID, rather than truncating them.
 *
 *
 * 5) Select the rows in the table using your mouse and copy/paste to a CSV file or whatever.
 *
 *
 *
 * Alternatively, you can use the Network tab:
 * 1) Navigate to your app in the firebaseAdmin.google.com console - e.g.
 *      https://console.firebaseAdmin.google.com/project/{your-project}/authentication/users
 * 2) Open the developer console and navigate to the network tab.
 * 3) Allow the page to fully load.
 * 4) Copy the response body of the 'queryaccount' request(s) that should now be present - these are cumulative, so
 *      keep that in mind if you want to have to change the 'Rows per page' to 250, etc.
 * 5) If you choose to paste this into a JSON file you could delete the extra nesting, leaving you with a single array
 *      of all the users (well, up to 250 of them) in the database. Each 'user' is represented as more nested arrays.
 *      My preference is to just use the UID and the Admin Framework to get real 'user' representations, but you could
 *      certainly hydrate the array form back into a more structured representation.
 */
import fs = require('fs');
import {task} from 'gulp';
import {join} from 'path';
import crypto = require('crypto')
import {PROJECT_ROOT} from '../constants';
const jsonFile = require('jsonfile');
const firebaseAdmin = require("firebase-admin");
const readline = require('readline');
import {firebaseConfig} from './firebase-config'
import {ReadLine} from "readline";

/**
 *
 */

const PASSWORD_LENGTH = 12
const JSON_FILE_WRITE_CONFIG = {spaces: 2}
const DEFAULTS_PATH = join(PROJECT_ROOT, 'config/authorization-service/basic-defaults/')
const filePaths = {
  authData: join(DEFAULTS_PATH, 'auth-data-structure.json'),
  authUsersPublic: join(DEFAULTS_PATH, 'users.json'),
  authUsersLocal: join(DEFAULTS_PATH, 'users.local.json'),
  authUsersLocalTS: join(DEFAULTS_PATH, 'users.local.ts'),
  firebaseRC: join(PROJECT_ROOT, '.firebaserc'),
  firebaseConfig: join(PROJECT_ROOT, 'config/authorization-service/firebase-config.local.ts'),
  accountKey: join(PROJECT_ROOT, "firebaseAdmin.service-account-key.local.json"),
  usersToDelete: join(PROJECT_ROOT, 'firebaseAdmin.users-to-delete.local.json')
}


class RemoteProjectInitializer {
  static initAuthUsers(): Promise<void> {
    let promises: Promise<void>[] = []
    let admin = initializeFirebaseApp()
    let auth:admin.auth.Auth = firebaseAdmin.auth()
    let users = jsonFile.readFileSync(filePaths.authUsersLocal)
    users.forEach((user: any) => {
      if (user.uid) {
        let promise: Promise<void> = new Promise((resolve, reject) => {
          auth.getUser(user.uid).then(() => {
            auth.updateUser(user.uid, user).then(() => resolve()).catch((e:any) => {
              console.log('Error updating user: ', e)
              reject(e)
            })
          }).catch((e:any) => {
            // doesn't exist yet.
            auth.createUser(user).then(() => resolve()).catch((e:any) => {
              console.log('Error creating user: ', e)
              reject(e)
            })
          })
        })
        promises.push(promise)
      }
    })
    return Promise.all(promises)
  }

  static pushDefaultAuth(): Promise<void> {
    let admin = initializeFirebaseApp()
    // Silly hack to get autocomplete.
    //noinspection UnnecessaryLocalVariableJS
    let dbX:any= firebaseAdmin.database()
    let db:admin.database.Database = dbX


    return new Promise((resolve, reject) => {
      let ref = db.ref("/auth");
      ref.once("value", (snapshot: any) => {
        if(snapshot.exists()){
          console.log('Skipping: Auth data already populated.')
          db.goOffline()
          resolve()
        } else{
          let authData = jsonFile.readFileSync(filePaths.authData)
          ref.set(authData, (error:any)=>{
            if(error){
              console.error('Error pushing default Authentication configuration to firebaseAdmin.', error)
            } else{
              console.log(`   pushed Auth data to remote Firebase project.`)
            }
            db.goOffline()
            resolve()
          })
        }
      }, (error:any) => {
        console.error('Error pushing default Authentication configuration to firebaseAdmin.', error)
        db.goOffline()
        resolve()
      })
    });
  }
}

class ProjectInitializer {


  static emailForUser(user: any, rl: ReadLine): Promise<any> {
    return new Promise((resolve, reject) => {
      rl.question(`Email address for user '${user.displayName}':  `, (email: string) => {
        let validUser = Object.assign({}, user, {
          email: email || `${user.uid}@example.com`,
          password: randomPassword(PASSWORD_LENGTH)
        })
        resolve(validUser)
      })
    });


  }

  static initAuthUsersConfig(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (fs.existsSync(filePaths.authUsersLocal)) {
        console.log(`==== Skipping: Found existing firebase users at ${filePaths.authUsersLocal} ====`)
        resolve()
      } else {
        console.log('=== Initializing Firebase Users ==== ')
        const rl = readline.createInterface({
          input: process.stdin,
          output: process.stdout
        });
        const authUsersAry: any[] = jsonFile.readFileSync(filePaths.authUsersPublic)
        let populateUsersPromise: Promise<any[]> = new Promise((resolveLoop, rejectLoop) => {
          let validAuthUsersAry: any[] = []

          let loopBody = () => {
            let u = authUsersAry.pop()
            ProjectInitializer.emailForUser(u, rl).then((validUser) => {
              validAuthUsersAry.push(validUser)
              if (authUsersAry.length) {
                loopBody()
              } else {
                rl.close()
                resolveLoop(validAuthUsersAry)
              }
            })
          }
          loopBody()
        });

        populateUsersPromise.then((validAuthUsersAry: any[]) => {
          jsonFile.writeFileSync(filePaths.authUsersLocal, validAuthUsersAry, JSON_FILE_WRITE_CONFIG)
          let output = "export const defaultUsers = " + JSON.stringify(validAuthUsersAry, null, 2)
          fs.writeFileSync(filePaths.authUsersLocalTS, output)
          console.log('    wrote users as JSON to: ', filePaths.authUsersLocal)
          console.log('    wrote users as TypeScript to: ', filePaths.authUsersLocalTS)
          resolve()
        })
      }
    })
  }


  static initFirebaseConfig(projectName: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (fs.existsSync(filePaths.firebaseConfig)) {
        console.log(`==== Skipping: Found existing firebase Configuration at ${filePaths.firebaseConfig} ====`)
        resolve()
      } else {
        console.log('==== Initializing Firebase Configuration ====')
        const rl = readline.createInterface({
          input: process.stdin,
          output: process.stdout
        });
        console.log(`You can find your api key at https://console.firebase.google.com/project/${projectName}/settings/general/`)
        try {
          rl.question(`Firebase API Key for project '${projectName}':  `, (apiKey: string) => {

            let validConfig = Object.assign({}, firebaseConfig, {
              apiKey: apiKey,
              authDomain: `${projectName}.firebaseapp.com`,
              databaseURL: `https://${projectName}.firebaseio.com`,
              storageBucket: `${projectName}.appspot.com`
            })
            let output = "export const firebaseConfig = " + JSON.stringify(validConfig, null, 2)
            fs.writeFileSync(filePaths.firebaseConfig, output)
            console.log('    Wrote configuration to ', filePaths.firebaseConfig)

            rl.close();
            resolve()
          });
        } catch (e) {
          reject(e)
        }
      }
    })
  }

  static initCertStub(projectName: string) {
    console.log('Visit your firebase console to create your service account cert file: ',
      `https://console.firebaseAdmin.google.com/project/${projectName}/settings/serviceaccounts/adminsdk`)

    jsonFile.writeFileSync(filePaths.accountKey, {
      "type": "service_account",
      "project_id": projectName,
      "private_key_id": "",
      "private_key": "",
      "client_email": "",
      "client_id": "",
      "auth_uri": "https://accounts.google.com/o/oauth2/auth",
      "token_uri": "https://accounts.google.com/o/oauth2/token",
      "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
      "client_x509_cert_url": `https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-0392v%40${projectName}.iam.gserviceaccount.com`
    }, JSON_FILE_WRITE_CONFIG)

    console.log('Wrote stub cert to ', filePaths.accountKey)


  }
}

task('firebase:init-project', (done: any) => {

  if (!fs.existsSync(filePaths.firebaseRC)) {
    throw new Error("You must configure a .firebaserc file with your project information in the root project directory")
  }
  let projectName = jsonFile.readFileSync(filePaths.firebaseRC).projects.default
  if (!fs.existsSync(filePaths.accountKey)) {
    ProjectInitializer.initCertStub(projectName)
    console.error("You must configure your firebase service account credentials.")
    done()
  } else {
    ProjectInitializer.initFirebaseConfig(projectName).then(() => {
      return ProjectInitializer.initAuthUsersConfig()
    }).then(() => {
      done()
    })
  }

})

task('firebase:clean-users', ['firebase:init-project'], (done: any) => {
  let promises: Promise<void>[] = []
  initializeFirebaseApp()
  let auth = firebaseAdmin.auth()

  let userIds = jsonFile.readFileSync(filePaths.usersToDelete)

  userIds.forEach((user: any) => {
    if (user[1] === null || user[1].startsWith('spec.')) {
      console.log('Deleting User:', user[0], user[1])
      promises.push(auth.deleteUser(user[0]))
    }
  })

  Promise.all(promises).then(() => done())
});


task('firebase:init-database',  (done: any) => {
  RemoteProjectInitializer.initAuthUsers().then(() => {
    RemoteProjectInitializer.pushDefaultAuth().then(()=>{
      console.log('Remote configuration complete.')
      done()
    }, (e:any)=>{
      console.log('error', e)
    })
  }, (e:any)=>{
    console.log('error', e)
  })
});

function randomPassword(length: number = 12): string {
  let password = crypto.randomBytes(length * 2).toString('base64')
  return password.substring(0, length)
}

let firebaseInitialized: boolean = false
function initializeFirebaseApp(): admin.app.App {
  if (!firebaseInitialized) {
    let firebaseProject = jsonFile.readFileSync(join(PROJECT_ROOT, '.firebaserc')).projects.default
    firebaseAdmin.initializeApp({
      credential: firebaseAdmin.credential.cert(filePaths.accountKey),
      databaseURL: "https://" + firebaseProject + ".firebaseio.com",
      databaseAuthVariableOverride: {
        uid: "gulp-service-worker"
      }
    });
    firebaseInitialized = true
  }
  return firebaseAdmin
}
