import {ChangeDetectionStrategy, Component, HostBinding, ViewEncapsulation} from '@angular/core'
import {AppRoutes} from '../../../app.routing.module'

@Component({
  selector:        'tanj-tryout-welcome-page',
  templateUrl:     './tryout-welcome.page.html',
  encapsulation:   ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.Default
})
export class TryoutWelcomePage {

  appRoutes = AppRoutes

  constructor() {
  }


}



