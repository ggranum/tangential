import {ChangeDetectionStrategy, Component} from '@angular/core'
import {Title} from '@angular/platform-browser'
import {ActivatedRouteSnapshot, Router, RouterStateSnapshot, RoutesRecognized} from '@angular/router'
import {MessageBus, NgUtil} from '@tangential/core'
import {GoogleAnalytics, GoogleAnalyticsFields} from '@tangential/analytics'

export interface PageData {
  seo?: any
  analytics?: GoogleAnalyticsFields
  showAds?: boolean
}

@Component({
  selector: 'app-component',
  template: `
              <tanj-main [ngClass]="{'tanj-showing-ads': showingAds}"></tanj-main>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {

  showingAds: boolean = false


  constructor(private analytics:GoogleAnalytics, private router: Router, private title: Title, bus: MessageBus) {
    router.events.subscribe({
      next: (ev) => {
        if (ev instanceof RoutesRecognized) {
          this.handleRouteRecognized(ev.state)
        }
      }
    })


  }

  getRouteInfo(leaf: ActivatedRouteSnapshot): PageData {
    const data: PageData = {}
    if (leaf && leaf.data) {
      data.analytics = leaf.data['analytics']
      data.seo = leaf.data['seo']
      data.showAds = leaf.data['showAds']
    }
    return data
  }


  handleRouteRecognized(state: RouterStateSnapshot) {
    const leaf = NgUtil.routeLeaf(state)
    const pageData = this.getRouteInfo(leaf)
    this.handleAnalytics(state, leaf, pageData)
    this.handleSeo(pageData)
    this.handleAds(pageData)
  }


  private handleAnalytics(state, leaf, pageData: PageData) {
    if (pageData.analytics) {
      this.analytics.navigatedTo(state, leaf, pageData.analytics)
    } else {
      this.analytics.navigatedToGeneric(state, leaf)
    }
  }

  private handleSeo(pageData: PageData) {
    if (pageData.seo && pageData.seo.title) {
      this.title.setTitle(pageData.seo.title)
    }
  }

  private handleAds(pageData: PageData) {
    this.showingAds = pageData.showAds
  }
}
