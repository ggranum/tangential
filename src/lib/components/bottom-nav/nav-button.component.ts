import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewEncapsulation} from '@angular/core'
import {Icon} from '../icon/icon'


@Component({
  selector:                                                  'tanj-nav-button',
  template:                                                  `<a color="accent"
                                                                 class="tanj-nav-button-icon"
                                                                 layout="column"
                                                                 layout-align="center center"
                                                                 [routerLink]="routerLink"
                                                                 (click)="onClick.next($event)">
    <tanj-icon [icon]="icon"></tanj-icon>
    <span class="tanj-nav-button-label">{{caption}}</span></a>`,
  host:                                                      {
    '[class.tanj-nav-button]': 'true',
    '[class.no-select]':      'true',
    'flex':                   '',
    'layout':                 'column',
    'layout-align':           'center center',
  },
  encapsulation:                                             ViewEncapsulation.None,
  changeDetection:                                           ChangeDetectionStrategy.OnPush
})
export class NavButtonComponent {

  @Input() routerLink: string[]
  @Input() icon: Icon
  @Input() caption: string

  @Output() onClick: EventEmitter<any> = new EventEmitter(false)


  constructor() {
  }

}



