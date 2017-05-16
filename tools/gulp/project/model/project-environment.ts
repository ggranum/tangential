import {GoogleAnalyticsConfig} from './google-analytics-config';
import {DefaultUserTemplates, ProjectUser, ProjectUserJson} from './project-user';
import {FirebaseEnvironment, FirebaseEnvironmentJson} from './firebase/firebase-environement';
import {Project} from './project';
import {AnalyticsNotInitialized} from '../exception/analytics-not-initialized';


export interface ProjectEnvironmentJson {
  name?: string
  suppressAds?: boolean
  production?: boolean
  googleAnalytics?: GoogleAnalyticsConfig
  firebase?: FirebaseEnvironmentJson
  projectUsers?: ProjectUserJson[]
}

export class ProjectEnvironment implements ProjectEnvironmentJson {
  name: string = 'dev'
  suppressAds: boolean = true
  production: boolean = false
  googleAnalytics: GoogleAnalyticsConfig = {
    enabled: true,
    trackingId: 'UA-00000000-1',
  }
  firebase: FirebaseEnvironment
  projectUsers: ProjectUser[] = []


  constructor(public project: Project, cfg?: ProjectEnvironmentJson | ProjectEnvironment) {
    cfg = cfg || {}

    this.name = cfg.name || this.name
    this.suppressAds = cfg.suppressAds === true
    this.production = cfg.production === true
    this.googleAnalytics = cfg.googleAnalytics || this.googleAnalytics
    this.firebase = new FirebaseEnvironment(this, cfg.firebase || this.firebase)
    this.projectUsers = (cfg.projectUsers || this.projectUsers).map(u => new ProjectUser(u))
  }

  initLocal(){
    this.firebase.initLocal()
  }

  updateLocal(){
    this.firebase.updateLocal()
  }

  checkValid() {
    this.checkAnalyticsValid()
    this.firebase.checkValid()
    this.checkProjectUsersValid()
  }

  checkProjectUsersValid(){
    this.projectUsers.forEach(user => user.checkValid() )
  }

  checkAnalyticsValid() {
    if (this.googleAnalytics.enabled && this.googleAnalytics.trackingId.indexOf('00000000') != -1) {
      throw new AnalyticsNotInitialized(this)
    }
  }

  toJson(): ProjectEnvironmentJson {
    return {
      name: this.name,
      suppressAds: this.suppressAds,
      production: this.production,
      googleAnalytics: this.googleAnalytics,
      firebase: this.firebase.toJson(),
      projectUsers: this.projectUsers.map(u => u.toJson()),
    }
  }

  static defaultDevEnv(project: Project) {
    let env = new ProjectEnvironment(project)
    env.projectUsers = DefaultUserTemplates.map(template => new ProjectUser(template, true))
    return env
  }

  static defaultProdEnv(project: Project) {
    let pe = new ProjectEnvironment(project, {
      name: 'prod',
      suppressAds: false,
      production: true,
      googleAnalytics: {
        enabled: true,
        trackingId: 'UA-00000000-2'
      },
      projectUsers: DefaultUserTemplates.map(template => new ProjectUser(template, true))
    })
    pe.firebase = FirebaseEnvironment.defaultProdEnv(pe)
    return pe
  }


}
