import {ChangeDetectionStrategy, Component, HostBinding, ViewEncapsulation} from '@angular/core'
import {DefaultPageAnalytics, MessageBus, Page, RouteInfo} from '@tangential/core';

@Component({
  selector:        'tanj-privacy-page',
  templateUrl:     './privacy.page.html',
  encapsulation:   ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.Default
})
export class PrivacyPage extends Page {

  override routeInfo:RouteInfo = {
    page: {
      title: 'Tangential: Privacy Policy'
    },
    analytics: DefaultPageAnalytics(),
    showAds: false
  }

  constructor(bus:MessageBus) {
    super(bus)

  }

}
