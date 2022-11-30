import {ChangeDetectionStrategy, Component, ViewEncapsulation} from '@angular/core'

@Component({
  selector:        'tanj-bottom-nav',
  templateUrl:     './bottom-nav.component.html',
  host:            {
    '[class.tanj-bottom-nav-component]': 'true',
    'flex':                             '',
    'layout':                           'row',
    'layout-align':                     'space-around',
  },
  encapsulation:   ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BottomNavComponent {


  constructor() {
  }

}



