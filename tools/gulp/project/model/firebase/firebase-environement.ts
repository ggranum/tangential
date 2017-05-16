import * as path from 'path';

import {FirebaseConfig} from './firebase-config';
import {RemoteProjectUtil} from '../../../firebase/remote-project-util';
import {JSON_FILE_WRITE_CONFIG, PROJECT_ROOT} from '../../../constants';
import {Env} from '../../../env';
import {Project} from '../project';
import {FirebasePrivateKeyNotInitialized} from '../../exception/firebase-private-key-not-initialized';
import {ProjectEnvironment} from '../project-environment';
import {FirebasePrivateKeyTemplate} from './firebase-private-key-config';
import fs = require('fs');

const jsonFile = require('jsonfile');
const FirebaseRcPath = path.join(PROJECT_ROOT, '.firebaserc')


export interface FirebaseEnvironmentJson {
  basePath?: string
  privateKeyPath?: string
  dbTemplateFilePath?: string
  rulesFilePath?: string
  backupDirName?: string
  config?: FirebaseConfig
}

/**
 * All paths are relative to `project.basePath`. Which is to say, the resolved path will be the result of
 * `path.join(this.project.basePath(), this.whateverPath)`
 */
export class FirebaseEnvironment implements FirebaseEnvironmentJson {

  backupDirName: string = './backups/dev'
  basePath: string = './dev'
  config: FirebaseConfig = {
    apiKey: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLM',
    messagingSenderId: '000000000000'
  }
  rulesFilePath: string = './database.rules.json'
  dbTemplateFilePath: string = './database.init.json'
  privateKeyPath: string = './dev/firebase-adminsdk-private-key.local.json'
  private project: Project

  constructor(private projectEnv: ProjectEnvironment, cfg?: FirebaseEnvironmentJson | FirebaseEnvironment) {
    cfg = cfg || {}
    this.project = projectEnv.project
    this.basePath = cfg.basePath || `./${this.projectEnv.name}`
    this.backupDirName = cfg.backupDirName || `./backups/${this.basePath}`
    this.rulesFilePath = cfg.rulesFilePath || this.rulesFilePath
    this.dbTemplateFilePath = cfg.dbTemplateFilePath || this.dbTemplateFilePath
    this.privateKeyPath = cfg.privateKeyPath || `${this.basePath}/firebase-adminsdk-private-key.local.json`
    this.config = cfg.config || {
        projectId: `${projectEnv.project.name}-${projectEnv.name}`,
        apiKey: this.config.apiKey,
        messagingSenderId: this.config.messagingSenderId,
      }

    this.updateConfigFromProjectId()
  }

  getBasePath(): string {
    return path.join(this.project.getBasePath(), this.basePath)
  }

  getPrivateKeyPath(): string {
    return path.join(this.project.getBasePath(), this.privateKeyPath)
  }

  getRulesFilePath(): string {
    return path.join(this.project.getBasePath(), this.rulesFilePath)
  }

  getDbTemplateFilePath(): string {
    return path.join(this.project.getBasePath(), this.dbTemplateFilePath)
  }

  initLocal() {
    this.updateConfigFromProjectId()
    this.updateFirebaseRcFile()
    this.writePrivateKeyFileStub()
  }

  updateLocal() {
    this.updateConfigFromProjectId()
    this.updateFirebaseRcFile()
  }

  updateConfigFromProjectId() {
    this.config.authDomain = `${this.config.projectId}.firebaseapp.com`
    this.config.databaseURL = `https://${this.config.projectId}.firebaseio.com`
    this.config.storageBucket = `${this.config.projectId}.appspot.com`
  }

  updateFirebaseRcFile() {
    let rcData = this.readFirebaseRc()
    rcData[this.projectEnv.name] = this.config.projectId
    this.writeFirebaseRc(rcData)
  }

  writePrivateKeyFileStub() {
    if (!this.verifyPrivateKeyFileExists()) {
      let keyPath = this.getPrivateKeyPath()
      jsonFile.writeFileSync(keyPath, FirebasePrivateKeyTemplate, JSON_FILE_WRITE_CONFIG)
      let msg = []
      msg.push(`Wrote Firebase Service Key stub file to ${keyPath}`)
      msg.push(`  ${path.basename(keyPath)} contains sensitive information and should NOT be committed to source control.`)
      msg.push(`  Please visit https://console.firebase.google.com/project/${this.config.projectId}/settings/serviceaccounts/adminsdk`)
      msg.push(`  to download your private key for this environment.`)
      console.log(msg.join('\n'))

    }
  }

  pushProjectUsersToRemote(): Promise<boolean> {
    try {
      this.project.checkInitialized('Cannot execute remote operations.')
      return RemoteProjectUtil.pushAuthenticationUsersFromUsersFile(this.project, this)
    } catch (e) {
      return Promise.reject(e)
    }
  }

  pushDatabaseTemplateToRemote(force: boolean = false): Promise<boolean> {
    try {
      this.project.checkInitialized('Cannot execute remote operations.')
      return RemoteProjectUtil.pushDatabase(this.project, this, force)
    } catch (e) {
      return Promise.reject(e)
    }
  }

  takeBackupFromRemote(baseDir: string): Promise<boolean> {
    try {
      this.project.checkInitialized('Cannot execute remote operations.')
      return RemoteProjectUtil.backupDatabase(this, `${path.join(baseDir, this.backupDirName)}`)
    } catch (e) {
      return Promise.reject(e)
    }
  }

  readDatabaseTemplate() {
    let templatePath = this.getDbTemplateFilePath()
    let data
    if (fs.existsSync(templatePath)) {
      data = jsonFile.readFileSync(templatePath)
    } else {
      console.log('There is no database initialization file available. Create and configure one at ' +
        +`'${templatePath}' if you wish to use this utility to overwrite your remote database.`)
    }
    return data
  }

  readFirebaseRc() {
    let data
    if (fs.existsSync(FirebaseRcPath)) {
      data = jsonFile.readFileSync(FirebaseRcPath)
    } else {
      data = {
        'projects': {}
      }
    }
    return data
  }

  writeFirebaseRc(data: any) {
    jsonFile.writeFileSync(FirebaseRcPath, data, JSON_FILE_WRITE_CONFIG)
  }

  checkValid() {
    this.checkPrivateKeyFileExists()
  }

  checkAccountCertKey() {
    if (!fs.existsSync(this.privateKeyPath)) {
      let msg = `Please save the private key cert file for this project to '${this.privateKeyPath}' \n`
        + `Visit your firebase console to create your service account cert file: \n`
        + `https://console.firebase.google.com/project/${this.config.projectId}/settings/serviceaccounts/adminsdk`
      console.log(msg)
      throw new Error(msg)
    }
  }

  checkFirebaseRcFileIsValid(): boolean {
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

  checkPrivateKeyFileExists() {
    if (!this.verifyPrivateKeyFileExists()) {
      throw new FirebasePrivateKeyNotInitialized(this.projectEnv)
    }
  }

  verifyPrivateKeyFileExists() {
    return fs.existsSync(this.getPrivateKeyPath())
  }

  toJson(): FirebaseEnvironmentJson {
    return {
      basePath: this.basePath,
      privateKeyPath: this.privateKeyPath,
      dbTemplateFilePath: this.dbTemplateFilePath,
      rulesFilePath: this.rulesFilePath,
      backupDirName: this.backupDirName,
      config: this.config,
    }
  }

  private readProjectId() {
    if (!this.checkFirebaseRcFileIsValid()) {
      throw new Error('You must configure a .firebaserc file with your project information in the root project directory')
    }
    // this.projectId = jsonFile.readFileSync(FirebaseRcPath).projects[Env.env()]
  }

  static defaultDevEnv(projectEnv: ProjectEnvironment): FirebaseEnvironment {
    return new FirebaseEnvironment(projectEnv, {
      basePath: './dev',
      backupDirName: 'prod'
    })
  }

  static defaultProdEnv(projectEnv: ProjectEnvironment): FirebaseEnvironment {
    return new FirebaseEnvironment(projectEnv, {
      basePath: './prod',
      backupDirName: 'prod'
    })
  }


}
