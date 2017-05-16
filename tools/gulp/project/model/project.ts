import * as path from 'path';
import fs = require('fs');
import {ProjectEnvironment, ProjectEnvironmentJson} from './project-environment';
import {DEFAULT_CONFIG_FILE_NAME, JSON_FILE_WRITE_CONFIG, PROJECT_ROOT} from '../../constants';
import {Env} from '../../env';
import {ProjectUser, ProjectUserJson} from './project-user';

const jsonFile = require('jsonfile');

export interface ProjectJson {
  name?: string
  configDirPath?: string
  backupDirPath?: string
  initialized?: boolean
  environments?: {[key:string]:ProjectEnvironmentJson}
}

export class Project implements ProjectJson {
  name: string = 'Tangential'
  configDirPath: string = './config'
  backupDirPath: string = './backups'
  initialized: boolean = false
  environments: {[key:string]:ProjectEnvironment} = {}

  constructor(cfg?: ProjectJson | Project) {
    cfg = cfg || {}
    this.name = cfg.name || this.name
    this.configDirPath = cfg.configDirPath || this.configDirPath
    this.backupDirPath = cfg.backupDirPath || this.backupDirPath
    this.initialized = cfg.initialized === true
    let environments = cfg.environments || {}
    Object.keys(environments).forEach(envKey => {
      this.environments[envKey]  = new ProjectEnvironment(cfg.environments[envKey])
    })
  }

  currentEnvironment() {
    let result = this.environments[Env.env()]
    if (!result) {
      throw new Error(`No environment found with name ${Env.env()}`)
    }
    return result
  }

  getBaseDir(){
    return path.join(PROJECT_ROOT, this.configDirPath)
  }

  getBackupDir(relativeDir?: string) {
    let p = path.join(this.getBaseDir(), this.backupDirPath)
    if(relativeDir){
      p = path.join(p, relativeDir)
    }
    if(!fs.existsSync(p)){
      fs.mkdirSync(p)
    }
    return p
  }

  write():void {
    let configPath = path.join(this.configDirPath, DEFAULT_CONFIG_FILE_NAME)
    if(fs.existsSync(configPath)){
      if(!Env.force){
        throw new Error(`Project configuration already exists at '${configPath}'. Re-run with --force flag to overwrite.`)
      } else {
        let backupName = path.basename(configPath, 'json')
        backupName = new Date().toISOString() + '-' + backupName + '.json'
        let backupPath = path.join(this.getBackupDir(), backupName)
        fs.createReadStream(configPath).pipe(fs.createWriteStream(backupPath));
      }
    }
    let json:ProjectJson = this.toJson()
    this.writeUserTs()
    this.writeEnvironmentTs()
    jsonFile.writeFileSync(configPath, this.toJson(), JSON_FILE_WRITE_CONFIG)
    console.log(`Wrote project configuration template to ${configPath}. Edit file to provide valid configuration for your project features.`)
  }

  writeUserTs():void {
    let configPath = path.join(this.configDirPath, 'users.local.ts')
    let users:{ [key:string] : ProjectUserJson[]} = {}
    Object.keys(this.environments).forEach(envKey => users[envKey] = this.environments[envKey].projectUsers)
    const output:string[] = []
    output.push('/**')
    output.push('* Import \'projectUsers\' in your integration tests to avoid hard-coding users and passwords into your committed code.')
    output.push('* This file is updated by the gulp task \'project:update-local\'.')
    output.push('*/')
    output.push('export const projectUsers = ' + JSON.stringify(users, null, 2))
    fs.writeFileSync(configPath, output.join('\n'))
  }

  writeEnvironmentTs():void {
    let configPath = path.join(PROJECT_ROOT, 'src/environments/environments.local.ts')
    let environments:ProjectEnvironmentJson[] = Object.keys(this.environments).map(envKey => this.environments[envKey])
    const output:string[] = []
    output.push('/**')
    output.push("* These environments are imported by the Angular CLI build tool (e.g. 'ng build', 'ng serve')")
    output.push("* Run the gulp task 'project:update-local' to update this file with any changes you've made to your project.local.json")
    output.push("* configuration.")
    output.push('*/')
    environments.forEach(env => {
      let envJson = JSON.stringify(env, null, 2)
      output.push(`export const ${env.name}Env = ${envJson}` + '\n\n')
    })

    fs.writeFileSync(configPath, output.join('\n'))
  }

  toJson():ProjectJson {
    let environments = {}
    Object.keys(this.environments).forEach(envKey => environments[envKey] = this.environments[envKey].toJson())
    return {
      name: this.name,
      configDirPath: this.configDirPath,
      backupDirPath: this.backupDirPath,
      initialized: this.initialized,
      environments: this.environments,
    }
  }

  static defaultProject(): Project {
    let project = new Project()
    project.environments['dev'] = ProjectEnvironment.defaultDevEnv()
    project.environments['prod'] = ProjectEnvironment.defaultProdEnv()
    return project
  }

  static init(baseDir:string):Project {
    let project = Project.defaultProject()
    project.configDirPath = path.relative(PROJECT_ROOT, baseDir)
    project.write()
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
