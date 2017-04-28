import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewEncapsulation
} from '@angular/core'
import {Hacks} from '@tangential/core'
//noinspection TypeScriptPreferShortImport
import {DateTimeIval} from '../../data-type/date-time/date-time-ival'
import {
  InputViewMode,
  InputViewModes
} from '../../support/input-view-mode'
//noinspection TypeScriptPreferShortImport
import {InputTemplateIF} from '../../support/template-components/input-template-component/input-template.component'
import {DateTimeInputConfig} from './date-time-input-config'
@Component({
  template:      `<!-- -->
  <ng-container *ngIf="mode == viewModes.VIEW || mode == viewModes.PREVIEW || mode == viewModes.EDIT  ">
    <tanj-date-time-widget [labelPosition]="config.labelPosition"
                          [disabled]="mode === viewModes.PREVIEW || config.disabled"
                          [label]="config.label"
                          [(value)]="ival.value"
                          [defaultToNow]="config.typeConfig.defaultToNow"
                          [defaultValue]="config.typeConfig.defaultValue">

    </tanj-date-time-widget>
  </ng-container>
  <ng-container *ngIf="mode == viewModes.CONFIGURE">
    <tanj-date-time-configure
      [labelPosition]="config.labelPosition"
      [(label)]="config.label"
      [(value)]="ival.value"
      [(defaultValue)]="config.typeConfig.defaultValue"
      [(defaultToNow)]="config.typeConfig.defaultToNow">
    </tanj-date-time-configure>
  </ng-container>

                 `,
  encapsulation: ViewEncapsulation.None
})
export class DateTimeTemplateComponent implements OnInit, InputTemplateIF {

  @Input() config: DateTimeInputConfig
  @Input() ival: DateTimeIval
  @Input() mode = <InputViewMode>null

  @Output() change: EventEmitter<any> = new EventEmitter(false)

  viewModes = InputViewModes

  constructor(private changeDetectorRef: ChangeDetectorRef) {

  }

  ngOnInit(): void {
    Hacks.materialDesignPlaceholderText(this.changeDetectorRef)
  }

}
