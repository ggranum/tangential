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
  } = {} as any // Class is another "we'd use an interface if we could, but compiler deletes interfaces"
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
  name: 'dev' | 'test' | 'stage' | 'prod' = 'dev'
  production: boolean = false
  suppressAds: boolean = false
}
