import {ChangeDetectionStrategy, Component, HostBinding, ViewEncapsulation} from '@angular/core'

@Component({
  selector:        'tanj-contact-component',
  templateUrl:     'contact.component.html',
  encapsulation:   ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.Default
})
export class ContactComponent {

  @HostBinding('attr.flex') flex = '';
  @HostBinding('attr.layout') flexLayout = 'column';
  @HostBinding('attr.layout-align') flexLayoutAlign = 'start';

  @HostBinding('class.tanj-themed') clazz = '';

  constructor() {
  }


}



