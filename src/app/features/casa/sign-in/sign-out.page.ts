import {AfterViewInit, ChangeDetectionStrategy, Component, ViewEncapsulation} from '@angular/core';
import {Router} from '@angular/router';
import {AuthenticationService} from '@tangential/authorization-service';
import {Logger, MessageBus, Page, RouteInfo} from '@tangential/core';
import {AppRouteDefinitions} from '../../../app.routes.definitions'

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
              protected logger: Logger,
              private router: Router,
              private authService: AuthenticationService) {
    super(bus)
  }

  ngAfterViewInit() {
    this.authService.signOut().then(() => {
      this.logger.debug(this, 'Sign out successful.')
      this.router.navigate(AppRouteDefinitions.home.navTargets.absSelf)
    })
  }

}

