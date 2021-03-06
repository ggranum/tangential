export class AppEnvironment {
  suppressAds: boolean
  production: boolean
  googleAnalytics?: {
    enabled: boolean
    trackingId: string
  }
  googleAdWords?: {
    enabled: boolean
    campaignId: string
    adClient: string
    adSlot: string
  }
  firebase: {
    config: {
      apiKey: string
      authDomain: string
      databaseURL: string
      projectId: string
      storageBucket: string
      messagingSenderId: string
    }
  }
}
