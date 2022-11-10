export class AppEnvironment {
  firebase: {
    privateKeyPath: string,
    databaseTemplatePath: string,
    databaseRulesPath: string,
    backupDirName: string,
    config: {
      apiKey: string
      authDomain: string
      databaseURL: string
      projectId: string
      storageBucket: string
      messagingSenderId: string
    }
  }
  googleAdWords?: {
    enabled: boolean
    campaignId: string
    adClient: string
    adSlot: string
  }
  googleAnalytics?: {
    enabled: boolean
    trackingId: string
  }
  name: 'dev' | 'test' | 'stage' | 'prod'
  production: boolean
  suppressAds: boolean
}
