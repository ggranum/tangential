import {ChangeDetectionStrategy, Component, EventEmitter, HostBinding, Input, OnInit, Output, ViewEncapsulation} from '@angular/core'

@Component({
  selector:        'tanj-tip-dialog-footer',
  templateUrl:     'tip-dialog-footer.component.html',
  encapsulation:   ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.Default
})
export class TipDialogFooterComponent implements OnInit {

  @HostBinding('attr.flex') flex = '';
  @HostBinding('attr.layout') flexLayout = 'column';
  @HostBinding('attr.layout-align') flexLayoutAlign = 'start';

  @HostBinding('class.tanj-themed') clazz = true;

  @Input() offerToSuppress: boolean
  @Input() doNotShowAgain: boolean
  @Output() doNotShowAgainChange: EventEmitter<boolean> = new EventEmitter(false)
  @Output() closeRequest: EventEmitter<boolean> = new EventEmitter(false)

  constructor() {
  }

  ngOnInit() {

  }


}



