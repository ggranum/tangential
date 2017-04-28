import {ChangeDetectionStrategy, Component, HostBinding, ViewEncapsulation} from '@angular/core'

@Component({
  selector:        'tanj-about-component',
  templateUrl:     'about.component.html',
  encapsulation:   ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.Default
})
export class AboutComponent {

  @HostBinding('attr.flex') flex = '';
  @HostBinding('attr.layout') flexLayout = 'column';
  @HostBinding('attr.layout-align') flexLayoutAlign = 'start';

  @HostBinding('class.tanj-themed') clazz = true;

  constructor() {
  }


}



