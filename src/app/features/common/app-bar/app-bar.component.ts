import {ChangeDetectionStrategy, Component, Input, ViewEncapsulation} from '@angular/core'
import {Router} from '@angular/router'
import {AuthService} from '@tangential/authorization-service'
import {MessageBus} from '@tangential/core'
import {Visitor} from '@tangential/visitor-service'
import {AppRoutes} from '../../../app.routing.module'
import {AppEventMessage} from '../../../core/bus-events/app-event'

@Component({
  selector:        'tanj-app-bar',
  templateUrl:     'app-bar.component.html',
  encapsulation:   ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppBarComponent {
  @Input() visitor: Visitor
  @Input() title = 'Tangential'

  appRoutes = AppRoutes

  constructor(private router: Router,
              private bus: MessageBus,
              private visitorService: AuthService) {
  }

  onSignOut() {
    this.visitorService.signOut().then(() => {
      this.router.navigate(AppRoutes.home.navTargets.absSelf)
    })
  }

  openNav() {
    this.bus.post(AppEventMessage.openAppNavRequest())
  }

}



