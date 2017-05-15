import {ChangeDetectionStrategy, Component, Input, ViewEncapsulation} from '@angular/core';
import {Menu} from '@tangential/components';

@Component({
  selector:        'tanj-side-nav-menu',
  templateUrl:     './side-nav-menu.component.html',
  encapsulation:   ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SideNavMenuComponent{

  @Input() menu: Menu = null

  constructor() {
  }

}
