import {AfterViewInit, ChangeDetectionStrategy, Component, ViewEncapsulation} from '@angular/core'
import {Router} from '@angular/router'
import {AuthService} from '@tangential/authorization-service'
import {Logger, MessageBus} from '@tangential/core'
import {AppRoutes} from '../../../app.routing.module'

@Component({
  selector:        'tanj-sign-out-page',
  template:        ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation:   ViewEncapsulation.None
})
export class SignOutPage implements AfterViewInit {


  constructor(private router: Router,
              private bus: MessageBus,
              private visitorService: AuthService) {
  }

  ngAfterViewInit() {
    this.visitorService.signOut().then(() => {
      Logger.debug(this.bus, this, 'Sign out successful.')
      this.router.navigate(AppRoutes.home.navTargets.absSelf)
    })
  }

}

