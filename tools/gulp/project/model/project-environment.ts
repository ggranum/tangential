import {GoogleAnalyticsConfig} from './google-analytics-config';
import {DefaultUserTemplates, ProjectUser, ProjectUserJson} from './project-user';
import {FirebaseEnvironment, FirebaseEnvironmentJson} from './firebase/firebase-environement';



export interface ProjectEnvironmentJson {
  name?: string
  suppressAds?: boolean
  production?: boolean
  googleAnalytics?: GoogleAnalyticsConfig
  firebase?: FirebaseEnvironmentJson
  projectUsers?:ProjectUserJson[]
}

export class ProjectEnvironment implements ProjectEnvironmentJson{
  name: string = 'dev'
  suppressAds: boolean = true
  production: boolean = false
  googleAnalytics: GoogleAnalyticsConfig = {
    enabled: true,
    trackingId: 'UA-00000000-1',
  }
  firebase: FirebaseEnvironment = FirebaseEnvironment.defaultDevEnv()
  projectUsers:ProjectUser[] = []


  constructor(cfg?: ProjectEnvironmentJson | ProjectEnvironment) {
    cfg = cfg || {}
    this.name = cfg.name || this.name
    this.suppressAds = cfg.suppressAds === true
    this.production = cfg.production === true
    this.googleAnalytics = cfg.googleAnalytics || this.googleAnalytics
    this.firebase = new FirebaseEnvironment(cfg.firebase || this.firebase)
    this.projectUsers = (cfg.projectUsers || this.projectUsers).map(u => new ProjectUser(u))
  }

  static defaultDevEnv(){
    let env = new ProjectEnvironment()
    env.projectUsers = DefaultUserTemplates.map(template => new ProjectUser(template, true))
    return env
  }

  static defaultProdEnv() {
    return new ProjectEnvironment({
      name: 'prod',
      suppressAds: false,
      production: true,
      googleAnalytics: {
        enabled: true,
        trackingId: 'US-00000000-2'
      },
      firebase: FirebaseEnvironment.defaultProdEnv(),
      projectUsers: DefaultUserTemplates.map(template => new ProjectUser(template, true))
    })
  }

  toJson():ProjectEnvironmentJson {
    return {
      name: this.name,
      suppressAds: this.suppressAds,
      production: this.production,
      googleAnalytics: this.googleAnalytics,
      firebase: this.firebase.toJson(),
      projectUsers: this.projectUsers.map(u => u.toJson()),
    }
  }
}
