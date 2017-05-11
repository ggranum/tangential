import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation
} from '@angular/core'

@Component({
  selector:         'tanj-pagination-bar', templateUrl: './pagination-bar.component.html', host: {
    '[class.no-select]': 'true',
  }, encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaginationBarComponent {

  @Input() nextEnabled: boolean = false
  @Input() previousEnabled: boolean = false

  @Output() end: EventEmitter<MouseEvent> = new EventEmitter(false)
  @Output() next: EventEmitter<MouseEvent> = new EventEmitter(false)
  @Output() start: EventEmitter<MouseEvent> = new EventEmitter(false)
  @Output() previous: EventEmitter<MouseEvent> = new EventEmitter(false)

  constructor() {
  }

}



