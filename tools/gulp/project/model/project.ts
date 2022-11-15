import * as path from 'path';
import {ProjectEnvironment, ProjectEnvironmentJson} from './project-environment';
import {DEFAULT_CONFIG_FILE_NAME, JSON_FILE_WRITE_CONFIG, PROJECT_ROOT} from '../../constants';
import {Env} from '../../env';
import {ProjectUserJson} from './project-user';
import {ProjectNotInitialized} from '../exception/project-not-initialized';
import {ProjectConfigurationNotFound} from '../exception/project-configuration-not-found';
import fs = require('fs');

const jsonFile = require('jsonfile');

export interface ProjectJson {
  name?: string
  basePath?: string
  backupPath?: string
  initialized?: boolean
  environments?: { [key: string]: ProjectEnvironmentJson }
}

export class Project implements ProjectJson {
  backupPath: string = './backups'
  basePath: string = './config'
  environments: { [key: string]: ProjectEnvironment } = {}
  initialized: boolean = false
  name: string = 'Tangential'

  constructor(cfg?: ProjectJson | Project) {
    cfg = cfg || {}
    this.name = cfg.name || this.getNameFromPath()
    this.basePath = cfg.basePath || this.basePath
    this.backupPath = cfg.backupPath || this.backupPath
    this.initialized = cfg.initialized === true
    let environments = cfg.environments || {}
    Object.keys(environments).forEach(envKey => {
      this.environments[envKey] = new ProjectEnvironment(this, cfg.environments[envKey])
    })
  }

  get environmentsAry() {
    return Object.keys(this.environments).map(key => this.environments[key])
  }

  getBackupPath() {
    let p = path.join(this.getBasePath(), this.backupPath)
    if (!fs.existsSync(p)) {
      console.warn(`Project backup path does not exist: Creating directory ${p}`)
      fs.mkdirSync(p)
    }
    return p
  }

  getBasePath() {
    return path.join(PROJECT_ROOT, this.basePath)
  }

  getConfigFilePath() {
    return path.join(this.getBasePath(), DEFAULT_CONFIG_FILE_NAME)
  }

  getNameFromPath(): string {
    console.log('Project', 'getNameFromPath', path.basename(PROJECT_ROOT))
    return path.basename(PROJECT_ROOT)
  }

  initLocal() {
    let configPath = this.getConfigFilePath()
    if (this.verifyConfigFileExists()) {
      if (!Env.force) {
        throw new Error(`Project configuration already exists at '${configPath}'. Re-run with --force flag to overwrite.`)
      } else {
        this.backup()
      }
    }
    this.environmentsAry.forEach(env => env.initLocal())
    this.writeUserTs()
    this.writeEnvironmentsTs()
    this.write()
    console.log(`Wrote project configuration template to ${configPath}.`
      + `Edit this file to provide valid configuration for your project features.`)
    console.log(`    === ${path.basename(configPath)} contains sensitive information and should NOT be committed to version control ===`)
  }

  updateLocal() {
    this.environmentsAry.forEach(env => env.updateLocal())
    this.writeUserTs()
    this.writeEnvironmentsTs()
  }

  currentEnvironment() {
    let result = this.environments[Env.env()]
    if (!result) {
      throw new Error(`No environment found with name ${Env.env()}`)
    }
    return result
  }

  validate() {
    this.checkValid()
    /* Won't get here if not valid. */
    this.initialized = true
    this.backup()
    this.write()
    console.log("Project validated successfully. Setting initialized to true: project is now ready for remote operations (e.g. 'publish').")
  }

  backup() {
    let backupName = new Date().toISOString() + '-' + path.basename(this.getConfigFilePath())
    let backupPath = path.join(this.getBackupPath(), backupName)
    fs.createReadStream(this.getConfigFilePath()).pipe(fs.createWriteStream(backupPath));
  }

  write(): void {
    let configPath = this.getConfigFilePath()
    jsonFile.writeFileSync(configPath, this.toJson(), JSON_FILE_WRITE_CONFIG)
  }

  writeUserTs(): void {
    let configPath = path.join(this.basePath, 'users.local.ts')
    let users: { [key: string]: ProjectUserJson[] } = {}
    Object.keys(this.environments).forEach(envKey => users[envKey] = this.environments[envKey].projectUsers)
    const output: string[] = []
    output.push('/**')
    output.push('* Import \'projectUsers\' in your integration tests to avoid hard-coding users and passwords into your committed code.')
    output.push('* This file is updated by the gulp task \'project:update-local\'.')
    output.push('* === This file contains sensitive information and should NOT be committed to version control. ===')
    output.push('*/')
    output.push('export const projectUsers = ' + JSON.stringify(users, null, 2))
    fs.writeFileSync(configPath, output.join('\n'))
    console.log(`Wrote local users file to: ${configPath}.`
      + `\n    === ${path.basename(configPath)} contains sensitive information and should NOT be committed to version control ===`)
  }

  writeEnvironmentsTs(): void {
    let configPath = path.join(PROJECT_ROOT, 'src/environments/environments.local.ts')
    let environments: ProjectEnvironmentJson[] = Object.keys(this.environments).map(envKey => this.environments[envKey].toJson())
    const output: string[] = []
    output.push('/**')
    output.push('* These environments are imported by the Angular CLI build tool (e.g. \'ng build\', \'ng serve\')')
    output.push('* Run the gulp task \'project:update-local\' to update this file with any changes you\'ve made to your project.local.json')
    output.push('* configuration.')
    output.push('*')
    output.push('* === This file contains sensitive information and should NOT be committed to version control. ===')
    output.push('*/')
    environments.forEach(env => {
      let envJson = JSON.stringify(env, null, 2)
      output.push(`export const ${env.name}Env = ${envJson}` + '\n\n')
    })

    fs.writeFileSync(configPath, output.join('\n'))
    console.log(`Wrote local environment file to: ${configPath}.`
      + `\n     === ${path.basename(configPath)} contains sensitive information and should NOT be committed to version control ===`)

    environments.forEach(env => {
      this.writeEnvironmentTs(env.name)
    })
  }

  checkValid() {
    this.checkBasePathExists()
    this.checkConfigFileExists()
    this.checkEnvironments()
  }

  checkBasePathExists() {
    if (!fs.existsSync(this.getBasePath())) {
      throw new ProjectConfigurationNotFound(`Configuration Base directory '${this.getBasePath()}' does not exist.`)
    }
  }

  checkConfigFileExists() {
    if (!this.verifyConfigFileExists()) {
      throw new ProjectConfigurationNotFound(`Configuration File '${this.getConfigFilePath()}' does not exist.`)
    }
  }

  checkEnvironments() {
    Object.keys(this.environments).map(envKey => this.environments[envKey]).forEach(env => {
      env.checkValid()
    })
  }

  checkInitialized(errMsg: string) {
    if (!this.initialized) {
      throw new ProjectNotInitialized(`Project is not initialized: ${errMsg}`)
    }
  }

  verifyConfigFileExists(): boolean {
    return fs.existsSync(this.getConfigFilePath())
  }

  toJson(): ProjectJson {
    let environments = {}
    Object.keys(this.environments).forEach(envKey => environments[envKey] = this.environments[envKey].toJson())
    return {
      name: this.name,
      basePath: this.basePath,
      backupPath: this.backupPath,
      initialized: this.initialized,
      environments: environments,
    }
  }

  private writeEnvironmentTs(envName: string) {
    //
    //
    let configPath = path.join(PROJECT_ROOT, `src/environments/environment.${envName}.ts`)
    const output: string[] = []
    output.push(`import \{${envName}Env} from './environments.local'`)
    output.push('/**')
    output.push('* These environment files are consumed by the Angular CLI build tool (e.g. \'ng build\', \'ng serve\')')
    output.push('* The ng build targets will apply the environment file of the same name. ')
    output.push('* This environment will be consumed by the commonly used commands: ')
    output.push(`*     ng build -${envName} --aot -oh=all`)
    output.push(`*     ng serve -${envName} --host 0.0.0.0 -p 4200`)
    output.push(`*  And, generally, any ng * command with the -${envName} flag.`)
    output.push('* ')
    output.push('* This file does not contain sensitive information and can be committed to version control.')
    output.push('*/')
    output.push(`export const environment = ${envName}Env`)


    fs.writeFileSync(configPath, output.join('\n'))
    console.log(`Wrote ${envName} environment shim to: ${configPath}.`)
  }

  static defaultProject(): Project {
    let project = new Project()
    project.environments['dev'] = ProjectEnvironment.defaultDevEnv(project)
    project.environments['prod'] = ProjectEnvironment.defaultProdEnv(project)
    return project
  }

  static init(baseDir: string): Project {
    let project = Project.defaultProject()
    project.basePath = path.relative(PROJECT_ROOT, baseDir)
    project.initLocal()
    return project
  }

  static load(from: string): Project {
    if (!fs.existsSync(from)) {
      throw new Error('Could not load project from ' + from)
    }
    let projectJson: ProjectJson = jsonFile.readFileSync(from)

    return new Project(projectJson || <ProjectJson>{})
  }
}
