export interface PageInfo {
  title: string
}

export interface PageAnalyticsEvents {
  load?: boolean
  unload?: boolean
  scroll?: boolean
  click?: boolean
  mouseMove?: boolean
}

export interface PageAnalytics {
  events?: PageAnalyticsEvents
}

export interface RouteInfo {
  page?: PageInfo
  analytics?: PageAnalytics
  showAds?: boolean
}

export const DefaultPageAnalytics = function (): PageAnalytics {
  return {
    events: {
      load: true,
      unload: true
    }
  }
}
