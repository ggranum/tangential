import {
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewEncapsulation
} from '@angular/core'
import {AppToggleMainMenuRequest} from '@tangential/app'
import {Visitor} from '@tangential/authorization-service'
import {MessageBus} from '@tangential/core'

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

  onToggleMainMenuRequest() {
    this.bus.post(new AppToggleMainMenuRequest())
  }

}



