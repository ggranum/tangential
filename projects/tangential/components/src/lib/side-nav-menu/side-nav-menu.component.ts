import {ChangeDetectionStrategy, Component, Input, ViewEncapsulation} from '@angular/core';
import {Menu} from './menu';
import {Visitor} from '@tangential/authorization-service';

@Component({
  selector:        'tanj-side-nav-menu',
  templateUrl:     './side-nav-menu.component.html',
  encapsulation:   ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SideNavMenuComponent{

  @Input() visitor: Visitor = null
  @Input() menu: Menu = null

  constructor() {
  }

}
