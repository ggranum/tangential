import {Component, EventEmitter, HostBinding, Input, Output, ViewEncapsulation} from '@angular/core'
@Component({
  selector:      'tanj-message-dialog-container',
  templateUrl:   './message-dialog-container.component.html',
  encapsulation: ViewEncapsulation.None
})
export class MessageDialogContainerComponent {

  @HostBinding('class') clazz = 'tanj-tip-dialog'
  @HostBinding('attr.flex') flex = '';
  @HostBinding('attr.layout') flexLayout = 'column';
  @HostBinding('attr.layout-align') flexLayoutAlign = 'start'

  @Input() heading: string = ''
  @Input() messageIcon: string = null
  @Input() offerToSuppress: boolean = true
  @Input() doNotShowAgain: boolean = false

  @Output() doNotShowAgainChange: EventEmitter<boolean> = new EventEmitter(false)
  @Output() closeRequest: EventEmitter<boolean> = new EventEmitter(false)

  constructor() {
  }

  onDoNotShowAgain(value: boolean) {
    this.doNotShowAgain = value;
    this.doNotShowAgainChange.emit(value)
  }
}
