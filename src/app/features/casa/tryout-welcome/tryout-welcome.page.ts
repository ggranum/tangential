import {ChangeDetectionStrategy, Component, ViewEncapsulation} from '@angular/core';
import {AppRoutes} from '../../../app.routing.module';
import {DefaultPageAnalytics, MessageBus, Page, RouteInfo} from '@tangential/core';

@Component({
  selector: 'tanj-tryout-welcome-page',
  templateUrl: './tryout-welcome.page.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.Default
})
export class TryoutWelcomePage extends Page {

  appRoutes = AppRoutes

  routeInfo: RouteInfo = {
    page: {
      title: 'Tangential: Welcome'
    },
    analytics: DefaultPageAnalytics(),
    showAds: false
  }

  constructor(protected bus: MessageBus) {
    super(bus)
  }


}



