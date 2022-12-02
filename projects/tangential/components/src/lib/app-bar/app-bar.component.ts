import {
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewEncapsulation
} from '@angular/core'
import {Visitor} from '@tangential/authorization-service'
import {Intention, MessageBus, AppMessage} from '@tangential/core'
import {filter, Observable} from 'rxjs'


export class ToggleMainMenuRequest extends AppMessage {
  static Key = 'openAppNavRequest'

  constructor() {
    super(Intention.request, ToggleMainMenuRequest.Key )
  }

  static override filter(bus:MessageBus):Observable<ToggleMainMenuRequest>{
    return bus.all.pipe(filter(msg => msg.source === AppMessage.SourceKey && msg.key === ToggleMainMenuRequest.Key))
  }
}


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
    this.bus.post(new ToggleMainMenuRequest())
  }

}



