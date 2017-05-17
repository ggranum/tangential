import * as path from 'path';

import {FirebaseConfig} from './firebase-config';
import {RemoteProjectUtil} from '../../firebase/remote-project-util';
import {JSON_FILE_WRITE_CONFIG, PROJECT_ROOT} from '../../../constants';
import {Env} from '../../../env';
import {Project} from '../project';
import {FirebasePrivateKeyNotInitialized} from '../../exception/firebase-private-key-not-initialized';
import {ProjectEnvironment} from '../project-environment';
import {FirebasePrivateKeyConfig, FirebasePrivateKeyTemplate} from './firebase-private-key-config';
import fs = require('fs');
import {FirebasePrivateKeyMismatch} from '../../exception/firebase-private-key-mismatch';

const jsonFile = require('jsonfile');
const FirebaseRcPath = path.join(PROJECT_ROOT, '.firebaserc')


export interface FirebaseEnvironmentJson {
  basePath?: string
  privateKeyPath?: string
  dbTemplateFilePath?: string
  rulesFilePath?: string
  backupPath?: string
  config?: FirebaseConfig
}

/**
 * All paths are relative to `project.basePath`. Which is to say, the resolved path will be the result of
 * `path.join(this.project.basePath(), this.whateverPath)`
 */
export class FirebaseEnvironment implements FirebaseEnvironmentJson {

  backupPath: string = 'backups/dev'
  basePath: string = 'dev'
  config: FirebaseConfig = {
    apiKey: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLM',
    messagingSenderId: '000000000000'
  }
  dbTemplateFilePath: string = 'database.init.json'
  privateKeyPath: string = 'dev/firebase-adminsdk-private-key.local.json'
  rulesFilePath: string = 'database.rules.json'
  private project: Project

  constructor(private projectEnv: ProjectEnvironment, cfg?: FirebaseEnvironmentJson | FirebaseEnvironment) {
    cfg = cfg || {}
    this.project = projectEnv.project
    this.basePath = cfg.basePath || `${this.projectEnv.name}`
    this.backupPath = cfg.backupPath || `backups/${this.basePath}`
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

  getBackupPath(): string {
    return path.join(this.project.getBasePath(), this.backupPath)
  }

  getDbTemplateFilePath(): string {
    return path.join(this.project.getBasePath(), this.dbTemplateFilePath)
  }

  getPrivateKeyPath(): string {
    return path.join(this.project.getBasePath(), this.privateKeyPath)
  }

  getRulesFilePath(): string {
    return path.join(this.project.getBasePath(), this.rulesFilePath)
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
    rcData.projects[this.projectEnv.name] = this.config.projectId
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
      this.project.checkValid()
      console.log(`Attempting to push users for environment ${this.projectEnv.name}`)
      return RemoteProjectUtil.pushAuthenticationUsersFromUsersFile(this.projectEnv, this)
    } catch (e) {
      return Promise.reject(e)
    }
  }

  pushDatabaseTemplateToRemote(force: boolean = false): Promise<boolean> {
    try {
      this.project.checkInitialized('Cannot execute remote operations.')
      this.project.checkValid()
      return RemoteProjectUtil.pushDatabase(this.project, this, force)
    } catch (e) {
      return Promise.reject(e)
    }
  }

  takeBackupFromRemote(b): Promise<boolean> {
    try {
      this.project.checkInitialized('Cannot execute remote operations.')
      this.project.checkValid()
      return RemoteProjectUtil.backupDatabase(this, `${path.join(this.getBackupPath(), this.backupPath)}`)
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
        'projects': {
          'default': this.project.environments['dev'].firebase.config.projectId
        }
      }
    }
    return data
  }

  writeFirebaseRc(data: any) {
    jsonFile.writeFileSync(FirebaseRcPath, data, JSON_FILE_WRITE_CONFIG)
  }

  checkValid() {
    this.checkPrivateKeyFileIsValid()
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

  checkPrivateKeyFileIsValid() {
    this.checkPrivateKeyFileExists()
    let keyData = this.readPrivateKeyFile()
    if(keyData.project_id !== this.config.projectId){
      throw new FirebasePrivateKeyMismatch(
        "Your Firebase service account private key project_id does not match your current environment's project id."
        + `\n     '${keyData.project_id}' != '${this.config.projectId}' `
        + `['Service Key File value' != '${this.projectEnv.name} environment Firebase project id'.]`)
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
      backupPath: this.backupPath,
      config: this.config,
    }
  }

  private readPrivateKeyFile(): FirebasePrivateKeyConfig {
    return jsonFile.readFileSync(this.getPrivateKeyPath())
  }
}
