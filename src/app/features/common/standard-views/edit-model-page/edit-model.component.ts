import {EventEmitter, HostBinding, Output} from '@angular/core'


/**
 * Maybe later...
 */

// @Component({
//   selector:        'tanj-edit-model',
//   templateUrl:     'edit-model.component.html',
//   encapsulation:   ViewEncapsulation.None,
//   changeDetection: ChangeDetectionStrategy.Default
// })
export class EditModelComponent {

  @HostBinding('attr.flex') flex = '';
  @HostBinding('attr.layout') flexLayout = 'column';
  @HostBinding('attr.layout-align') flexLayoutAlign = 'start';

  @Output() done: EventEmitter<void> = new EventEmitter<void>(false)


  constructor() {
  }


}

