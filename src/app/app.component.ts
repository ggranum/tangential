import {ChangeDetectionStrategy, Component} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {ActivatedRouteSnapshot, Router, RouterStateSnapshot, RoutesRecognized} from '@angular/router';
import {MessageBus, NgUtil, RouteInfo} from '@tangential/core';
import {GoogleAnalytics} from '@tangential/analytics';


@Component({
  selector: 'app-component',
  template: `
    <tanj-main [ngClass]="{'tanj-showing-ads': showingAds}"></tanj-main>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {

  showingAds: boolean = false

  constructor(bus: MessageBus,
              private analytics: GoogleAnalytics,
              private router: Router,
              private title: Title) {
    router.events.subscribe({
      next: (ev) => {
        if (ev instanceof RoutesRecognized) {
          this.handleRouteRecognized(ev.state)
        }
      }
    })
  }

  getRouteInfo(leaf: ActivatedRouteSnapshot): RouteInfo {
    const data: RouteInfo = {}
    if (leaf && leaf.data) {
      data.analytics = leaf.data['analytics']
      data.page = leaf.data['page']
      data.showAds = leaf.data['showAds']
    }
    return data
  }


  handleRouteRecognized(state: RouterStateSnapshot) {
    const leaf = NgUtil.routeLeaf(state)
    const pageData = this.getRouteInfo(leaf)
    this.handleAnalytics(state, leaf, pageData)
    this.handlePageInfo(pageData)
    this.handleAds(pageData)
  }


  private handleAnalytics(state, leaf, pageData: RouteInfo) {
    if (pageData.analytics) {
      this.analytics.navigatedTo(state, leaf, pageData.analytics)
    } else {
      this.analytics.navigatedToGeneric(state, leaf)
    }
  }

  private handlePageInfo(pageData: RouteInfo) {
    if (pageData.page && pageData.page.title) {
      this.title.setTitle(pageData.page.title)
    }
  }

  private handleAds(pageData: RouteInfo) {
    this.showingAds = pageData.showAds
  }
}
