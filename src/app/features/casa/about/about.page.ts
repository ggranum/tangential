import {ChangeDetectionStrategy, Component, ViewEncapsulation} from '@angular/core';
import {DefaultPageAnalytics, MessageBus, Page, RouteInfo} from '@tangential/core';

@Component({
  selector:        'tanj-about-page',
  templateUrl:     './about.page.html',
  encapsulation:   ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.Default
})
export class AboutPage extends Page {

  routeInfo:RouteInfo = {
    page: {
      title: 'Tangential: About'
    },
    analytics: DefaultPageAnalytics(),
    showAds: false
  }

  constructor(bus:MessageBus) {
    super(bus)
  }


}



