import {ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {Logger, MessageBus, NgUtil} from '@tangential/core';
import {Injectable} from '@angular/core';
import {AppEnvironment} from '@tangential/core';
export type HitType =
  'pageview' |
  'screenview' |
  'event' |
  'transaction' |
  'item' |
  'social' |
  'exception' |
  'timing'

export const HitTypes = {
  pageView: <HitType>'pageview',
  screenView: <HitType>'screenview',
  event: <HitType>'event',
  transaction: <HitType>'transaction',
  item: <HitType>'item',
  social: <HitType>'social',
  exception: <HitType>'exception',
  timing: <HitType>'timing',
}

export interface GoogleAnalyticsFields {
  hitType?: HitType,
  title?: string,
  page?: string,
  location?: string,

  eventCategory?: string,
  eventAction?: string,
  eventLabel?: string
}

declare type GaFunction = (action: string, fields?: GoogleAnalyticsFields | string, other?: string) => void
//noinspection ES6ConvertVarToLetConst
declare var ga: (action: string, fields?: GoogleAnalyticsFields | string, other?: string) => void;
declare const window

@Injectable()
export class GoogleAnalytics {


  private analytics: GaFunction = (a: string, fields: GoogleAnalyticsFields, other?: string) => {
    if (other) {
      Logger.trace(this.bus, this, a, fields, other)
    } else {
      Logger.trace(this.bus, this, a, fields)
    }
  }

  constructor(private bus: MessageBus, private env: AppEnvironment) {
    let cfg = env.googleAnalytics
    if (cfg && cfg.enabled) {
      this.awaitGoogle(5000).then(windowGa => {
        this.analytics = windowGa
        this.create()
      })

    }
  }

  awaitGoogle(waitMils: number): Promise<GaFunction> {
    return new Promise<GaFunction>((resolve) => {
      let started = Date.now()
      let abortAt = started + waitMils
      let fn = () => {
        if (window.ga) {
          resolve(window.ga)
        } else if(Date.now() > abortAt){
          resolve(this.analytics)
        } else {
          setTimeout(fn, 50)
        }
      }
    })
  }

  create() {
    this.analytics('create', this.env.googleAnalytics.trackingId, 'auto');
    this.analytics('send', 'pageview');
  }


  navigatedToGeneric(state: RouterStateSnapshot, route: ActivatedRouteSnapshot) {
    const hit: GoogleAnalyticsFields = {
      hitType: HitTypes.pageView,
      eventCategory: 'nav',
      eventLabel: 'general'
    }

    this.analytics('set', 'page', hit.page || state.url)
    this.analytics('send', 'generic')
  }

  navigatedTo(state: RouterStateSnapshot, route: ActivatedRouteSnapshot, hit: GoogleAnalyticsFields) {
    hit.hitType = HitTypes.pageView
    this.analytics('set', 'page', hit.page || NgUtil.keylessUrl(state))
    this.analytics('send', hit)
  }

}
