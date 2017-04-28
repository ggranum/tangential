import {ChangeDetectionStrategy, Component, ViewEncapsulation} from '@angular/core';
import {DefaultPageAnalytics, MessageBus, Page, RouteInfo} from '@tangential/core';

@Component({
  selector:        'tanj-contact-page',
  templateUrl:     './contact.page.html',
  encapsulation:   ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.Default
})
export class ContactPage extends Page {

  routeInfo:RouteInfo = {
    page: {
      title: 'Tangential: Contact'
    },
    analytics: DefaultPageAnalytics(),
    showAds: false
  }

  constructor(bus:MessageBus) {
    super(bus)
  }


}



