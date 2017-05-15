import * as path from 'path';
import fs = require('fs');

import {FirebaseConfig} from './firebase-config';
import {RemoteProjectUtil} from '../../../firebase/remote-project-util';
import {PROJECT_ROOT} from '../../../constants';
import {Env} from '../../../env';
import {Project} from '../project';
const jsonFile = require('jsonfile');


const FirebaseRcPath = path.join(PROJECT_ROOT, '.firebaserc')


export interface FirebaseEnvironmentJson {
  basePath?: string
  privateKeyPath?: string
  databaseTemplatePath?: string
  databaseRulesPath?: string
  backupDirName?: string
  config?: FirebaseConfig
}

export class FirebaseEnvironment implements FirebaseEnvironmentJson {
  basePath: string = './dev'
  privateKeyPath: string = './firebase-adminsdk-private-key.local.json'
  databaseTemplatePath: string = '../database.init.json'
  databaseRulesPath: string = '../database.rules.json'
  backupDirName: string = 'dev'
  config: FirebaseConfig = {
    projectId: '${your-project-name}-dev',
    apiKey: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLM',
    authDomain: '${your-project-name}-dev.firebaseapp.com',
    databaseURL: 'https://${your-project-name}-dev.firebaseio.com',
    storageBucket: '${your-project-name}-dev.appspot.com',
    messagingSenderId: '000000000000'
  }


  constructor(cfg?: FirebaseEnvironmentJson | FirebaseEnvironment) {
    cfg = cfg || {}
    this.basePath = cfg.basePath
    this.basePath = cfg.basePath
  }

  takeBackup(baseDir:string) {
    return RemoteProjectUtil.backupDatabase(this, `${path.join(baseDir, this.backupDirName)}`)
  }

  pushProjectUsersToRemote(project:Project): Promise<boolean> {
    return RemoteProjectUtil.pushAuthenticationUsersFromUsersFile(project, this)
  }

  pushDatabaseTemplate(project:Project, force: boolean = false): Promise<boolean> {
    return RemoteProjectUtil.pushDatabase(project, this, force)
  }


  private readProjectId() {
    if (!this.checkFirebaseRcFileIsValid()) {
      throw new Error('You must configure a .firebaserc file with your project information in the root project directory')
    }
    // this.projectId = jsonFile.readFileSync(FirebaseRcPath).projects[Env.env()]
  }

  private checkAccountCertKey() {
    if (!fs.existsSync(this.privateKeyPath)) {
      let msg = `Please save the private key cert file for this project to '${this.privateKeyPath}' \n`
        + `Visit your firebase console to create your service account cert file: \n`
        + `https://console.firebase.google.com/project/${this.config.projectId}/settings/serviceaccounts/adminsdk`
      console.log(msg)
      throw new Error(msg)
    }
  }


  getDatabaseTemplate() {
    let templatePath = this.databaseTemplatePath
    let data
    if (fs.existsSync(templatePath)) {
      data = jsonFile.readFileSync(templatePath)
    } else {
      console.log('There is no database initialization file available. Create and configure one at ' +
        +`'${templatePath}' if you wish to use this utility to overwrite your remote database.`)
    }
    return data
  }

  private checkFirebaseRcFileIsValid(): boolean {
    let valid = fs.existsSync(FirebaseRcPath)
    if (valid) {
      try {
        valid = jsonFile.readFileSync(FirebaseRcPath).projects[Env.env()] !== ''
      } catch (e) {
        console.log('FirebaseEnvironment', 'checkFirebaseRcFileIsValid', 'Error while reading firebaseRC file: ')
        throw  e
      }
    } else {
      throw new Error(`FirebaseRc file does not exist at ${FirebaseRcPath}`)
    }
    return valid
  }

  toJson():FirebaseEnvironmentJson {
    return {
      basePath: this.basePath,
      privateKeyPath: this.privateKeyPath,
      databaseTemplatePath: this.databaseTemplatePath,
      databaseRulesPath: this.databaseRulesPath,
      backupDirName: this.backupDirName,
      config: this.config,
    }
  }

  static defaultDevEnv(): FirebaseEnvironment {
    return new FirebaseEnvironment()
  }

  static defaultProdEnv(): FirebaseEnvironment {
    return new FirebaseEnvironment({
      basePath: './prod',
      backupDirName: 'prod',
      config: {
        projectId: '${your-project-name}-prod',
        apiKey: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLM',
        authDomain: '${your-project-name}-prod.firebaseapp.com',
        databaseURL: 'https://${your-project-name}-prod.firebaseio.com',
        storageBucket: '${your-project-name}-prod.appspot.com',
        messagingSenderId: '000000000000'
      }
    })
  }


}
