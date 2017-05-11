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
import {NumberIval} from '../../data-type/number/number-ival'
import {
  InputViewMode,
  InputViewModes
} from '../../support/input-view-mode'
//noinspection TypeScriptPreferShortImport
import {InputTemplateIF} from '../../support/template-components/input-template-component/input-template.component'
import {DurationPickerConfig} from './duration-picker-config'


@Component({
  template:      `<!-- -->
  <ng-container *ngIf="mode == viewModes.VIEW || mode == viewModes.PREVIEW || mode == viewModes.EDIT  ">
    <tanj-duration-picker-widget
      [(value)]="ival.value"
      [labelPosition]="config.labelPosition"
      [disabled]="mode === viewModes.PREVIEW || config.disabled"
      [label]="config.label"
      [showDays]="config?.showDurationFields.day"
      [showHours]="config?.showDurationFields.h"
      [showMinutes]="config?.showDurationFields.min"
      [showSeconds]="config?.showDurationFields.s"
      [showMilliseconds]="config?.showDurationFields.ms"
      [max]="config.typeConfig.max">

    </tanj-duration-picker-widget>
  </ng-container>
  <ng-container *ngIf="mode == viewModes.CONFIGURE">
    <tanj-duration-picker-widget-configure
      [labelPosition]="config.labelPosition"
      [(label)]="config.label"
      [(value)]="ival.value"
      [(defaultValue)]="config.typeConfig.defaultValue"
      [(showDays)]="config?.showDurationFields.day"
      [(showHours)]="config?.showDurationFields.h"
      [(showMinutes)]="config?.showDurationFields.min"
      [(showSeconds)]="config?.showDurationFields.s"
      [(showMilliseconds)]="config?.showDurationFields.ms"
      [(max)]="config.typeConfig.max">

    </tanj-duration-picker-widget-configure>
  </ng-container>

                 `,
  encapsulation: ViewEncapsulation.None
})
export class DurationPickerTemplateComponent implements OnInit, InputTemplateIF {

  @Input() config: DurationPickerConfig
  @Input() ival: NumberIval
  @Input() mode = <InputViewMode>null

  @Output() change: EventEmitter<any> = new EventEmitter(false)

  viewModes = InputViewModes


  constructor(private changeDetectorRef: ChangeDetectorRef) {

  }

  ngOnInit(): void {
    Hacks.materialDesignPlaceholderText(this.changeDetectorRef)
  }

}
