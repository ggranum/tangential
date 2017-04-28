import {AfterViewInit, ChangeDetectionStrategy, Component, ViewEncapsulation} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '@tangential/authorization-service';
import {Logger, MessageBus, Page, RouteInfo} from '@tangential/core';
import {AppRoutes} from '../../../app.routing.module';

/**
 * Provides an endpoint that allows a logout via direct navigation.
 * Immediately redirects user to home page.
 */
@Component({
  selector: 'tanj-sign-out-page',
  template: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class SignOutPage extends Page implements AfterViewInit {

  routeInfo: RouteInfo = {
    page: {
      title: 'Tangential: Sign Out'
    },
    analytics: {
      events: {
        load: true
      }
    },
    showAds: false
  }

  constructor(protected bus: MessageBus,
              private router: Router,
              private visitorService: AuthService) {
    super(bus)
  }

  ngAfterViewInit() {
    this.visitorService.signOut().then(() => {
      Logger.debug(this.bus, this, 'Sign out successful.')
      this.router.navigate(AppRoutes.home.navTargets.absSelf)
    })
  }

}

