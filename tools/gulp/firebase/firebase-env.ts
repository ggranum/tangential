import fs = require('fs');
import {join} from 'path';
import {PROJECT_ROOT} from '../constants';
import {Env} from '../env';
import {JSON_FILE_WRITE_CONFIG} from './constants';
import {LocalProjectUtil} from './local-project-util';
import {FirebaseProjectConfig, ProjectUserAuth} from './project-config';
import {RemoteProjectUtil} from './remote-project-util';
import crypto = require('crypto')
const jsonFile = require('jsonfile');
const readline = require('readline');


const FirebaseRcPath = join(PROJECT_ROOT, '.firebaserc')


const DefaultProjectUserTemplates: ProjectUserAuth[] = [
  {
    uid: 'Administrator',
    email: 'example+administrator@example.com',
    password: '',
    displayName: 'Administrator',
    disabled: false
  },
  {
    'uid': 'TestUser',
    'email': 'example+testuser@example.com',
    'password': '',
    'displayName': 'Test User',
    'disabled': false
  },
  {
    'uid': 'AssistantAdmin',
    'email': 'example+assistant@example.com',
    'password': '',
    'displayName': 'Assistant Administrator',
    'disabled': false
  }
]


const BlankFirebaseConfig: FirebaseProjectConfig = {
  apiKey: '',
  authDomain: '',
  databaseURL: '',
  projectId: '',
  storageBucket: '',
  messagingSenderId: '',
}

export class FirebaseEnvironment {
  envKey: string
  basePath: string
  commonBasePath: string

  projectId: string

  projectUserTemplates: ProjectUserAuth[]
  projectUsers: ProjectUserAuth[]

  projectConfig: FirebaseProjectConfig

  accountCertKeyFilePath: string
  projectUserTemplatesPath: string
  projectUsersPath: string
  projectUserTemplatesTSPath: string
  databaseTemplateDataPath: string
  projectConfigPath: string
  databaseTemplateData: string;


  constructor(envKey: string) {
    this.envKey = envKey
    this.basePath = `${PROJECT_ROOT}/config/${envKey}/firebase`
    this.commonBasePath = `${PROJECT_ROOT}/config/common/firebase/`
    this.accountCertKeyFilePath = `${this.basePath}/firebaseAdmin.service-account-key.local.json`
    this.projectUserTemplatesPath = `${this.basePath}/users.json`
    this.projectUsersPath = `${this.basePath}/users.local.json`
    this.projectUserTemplatesTSPath = `${this.basePath}/users.local.ts`
    this.databaseTemplateDataPath = `${this.basePath}/database.init.json`

    this.projectConfigPath = `${this.basePath}/firebase-config.local.json`
    this.readProjectId();
    this.checkAccountCertKey()
    this.readProjectUserTemplates()
    this.readFirebaseConfiguration()
    this.readDatabaseTemplate()
  }


  /**
   * Initialize a new project.
   * + Populate the users for the project
   * + ???? Profit
   */
  initProject(force: boolean = false): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      return this.populateProjectUsers(force)
    })
  }

  populateProjectUsers(force: boolean = false): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (!force && firebaseEnv.projectUsersReady()) {
        console.log(`==== Skipping: Found existing firebase users at ${firebaseEnv.projectUsersPath} ====`)
        resolve()
      } else {
        console.log('=== Initializing Firebase Users ==== ')
        const populateUsersPromise = LocalProjectUtil.transformUsers(this.projectUserTemplates)
        populateUsersPromise.then((validAuthUsersAry: any[]) => {
          try {
            jsonFile.writeFileSync(this.projectUserTemplatesPath, validAuthUsersAry, JSON_FILE_WRITE_CONFIG)
            const output = 'export const defaultUsers = ' + JSON.stringify(validAuthUsersAry, null, 2)
            fs.writeFileSync(this.projectUserTemplatesTSPath, output)
            console.log('    wrote users as JSON to: ', this.projectUserTemplatesPath)
            console.log('    wrote users as TypeScript to: ', this.projectUserTemplatesTSPath)
            resolve()
          } catch (e) {
            console.log('Error writing users to file.', e)
            reject(e)
          }
        })
      }
    })
  }


  projectUsersReady(): boolean {
    return this.projectUsers != null && this.projectUsers.length > 0
  }

  takeBackup() {
    return RemoteProjectUtil.backupDatabase(this, `${this.basePath}/backups/`)
  }

  pushProjectUsersToRemote(): Promise<boolean> {
    return RemoteProjectUtil.pushAuthenticationUsersFromUsersFile(this)
  }

  pushDatabaseTemplate(force: boolean = false): Promise<boolean> {
    return RemoteProjectUtil.pushDatabase(this, force)
  }



  private readProjectId() {
    if (!this.checkFirebaseRcFileIsValid()) {
      throw new Error('You must configure a .firebaserc file with your project information in the root project directory')
    }
    this.projectId = jsonFile.readFileSync(FirebaseRcPath).projects[Env.env()]
  }

  private checkAccountCertKey() {
    if (!fs.existsSync(this.accountCertKeyFilePath)) {
      let msg = `Please save the private key cert file for this project to '${this.accountCertKeyFilePath}' \n`
        + `Visit your firebase console to create your service account cert file: \n`
        + `https://console.firebase.google.com/project/${this.projectId}/settings/serviceaccounts/adminsdk`
      console.log(msg)
      throw new Error(msg)
    }
  }

  private readProjectUserTemplates() {
    if (fs.existsSync(this.projectUserTemplatesPath)) {
      this.projectUserTemplates = jsonFile.readFileSync(this.projectUserTemplatesPath)
      this.readProjectUsers()
    } else {
      jsonFile.writeFileSync(this.projectUserTemplatesPath, DefaultProjectUserTemplates, JSON_FILE_WRITE_CONFIG)
      console.log(`Wrote project user templates to ${this.projectUserTemplatesPath}. Check docs for details on how to configure default user accounts.`)
    }
  }

  private readProjectUsers() {
    if (fs.existsSync(this.projectUsersPath)) {
      this.projectUsers = jsonFile.readFileSync(this.projectUsersPath)
    }
  }

  private readFirebaseConfiguration() {
    if (fs.existsSync(this.projectConfigPath)) {
      this.projectConfig = jsonFile.readFileSync(this.projectConfigPath)
    } else {
      jsonFile.writeFileSync(this.projectConfigPath, BlankFirebaseConfig, JSON_FILE_WRITE_CONFIG)
      console.log(`Wrote project configuration templates to ${this.projectConfigPath}.`
        + ` Please update the file with the Firebase configuration for ${this.projectId}.`)
    }
  }

  private readDatabaseTemplate() {
    if (fs.existsSync(this.databaseTemplateDataPath)) {
      this.databaseTemplateData = jsonFile.readFileSync(this.databaseTemplateDataPath)
    } else if (fs.existsSync(`${this.commonBasePath}/database.init.json`)) {
      this.databaseTemplateData = jsonFile.readFileSync(`${this.commonBasePath}/database.init.json`)
    } else {
      console.log(`There is not database initialization file available. 
      Create and configure one at either '${this.databaseTemplateDataPath}' or '${this.commonBasePath}/database.init.json' if you wish to use this utility to overwrite your remote database.`)
    }
  }


  private checkAccountCertFileIsValid() {
    const valid = fs.existsSync(this.accountCertKeyFilePath)
    if (!valid) {
      throw new Error(`Invalid Account Cert Key file or not found: ${this.accountCertKeyFilePath}`)
    }
    return valid
  }

  private checkFirebaseRcFileIsValid(): boolean {
    let valid = fs.existsSync(FirebaseRcPath)
    if (valid) {
      try {
        valid = jsonFile.readFileSync(FirebaseRcPath).projects[Env.env()] != ''
      } catch (e) {
        console.log('FirebaseEnvironment', 'checkFirebaseRcFileIsValid', 'Error while reading firebaseRC file: ' )
        throw  e
      }
    } else {
      throw new Error(`FirebaseRc file does not exist at ${FirebaseRcPath}`)
    }
    return valid
  }


}


export const firebaseEnv = new FirebaseEnvironment(Env.env())
