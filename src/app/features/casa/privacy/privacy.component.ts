import {ChangeDetectionStrategy, Component, HostBinding, ViewEncapsulation} from '@angular/core'

@Component({
  selector:        'privacy-component',
  templateUrl:     'privacy.component.html',
  encapsulation:   ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.Default
})
export class PrivacyComponent {

  @HostBinding('attr.layout') flexLayout = 'column';
  @HostBinding('attr.layout-align') flexLayoutAlign = 'start';

  constructor() {
  }

}
