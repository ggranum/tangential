import {ChangeDetectionStrategy, Component, Input, ViewEncapsulation} from '@angular/core'
import {
  AppOpenNavRequest,
  MessageBus
} from '@tangential/core'
import {Visitor} from '@tangential/authorization-service'

@Component({
  selector:        'tanj-app-bar',
  templateUrl:     './app-bar.component.html',
  encapsulation:   ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppBarComponent {
  @Input() visitor: Visitor
  @Input() title = 'Tangential'

  constructor(private bus: MessageBus) {
  }

  openNav() {
    this.bus.post(new AppOpenNavRequest())
  }

}



