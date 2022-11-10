import {ChangeDetectionStrategy, Component, ViewEncapsulation} from '@angular/core';
import {AppRouteDefinitions} from '../../../app.routes.definitions'
import {DefaultPageAnalytics, MessageBus, Page, RouteInfo} from '@tangential/core';

@Component({
  selector: 'tanj-tryout-welcome-page',
  templateUrl: './tryout-welcome.page.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.Default
})
export class TryoutWelcomePage extends Page {

  appRoutes = AppRouteDefinitions

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



