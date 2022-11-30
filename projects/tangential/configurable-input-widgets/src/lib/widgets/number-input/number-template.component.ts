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
//noinspection ES6PreferShortImport
import {NumberIval} from '../../data-type/number/number-ival'
import {
  InputViewMode,
  InputViewModes
} from '../../support/input-view-mode'
//noinspection ES6PreferShortImport
import {InputTemplateIF} from '../../support/template-components/input-template-component/input-template.component'
import {NumberInputConfig} from './number-input-config'
@Component({
  template:      `<!-- -->
  <ng-container *ngIf="mode == viewModes.VIEW || mode == viewModes.PREVIEW || mode == viewModes.EDIT  ">
    <tanj-number-widget [labelPosition]="config.labelPosition"
                       [disabled]="mode === viewModes.PREVIEW || config.disabled"
                       [label]="config.label"
                       [(value)]="ival.value"
                       [max]="config.typeConfig.max"
                       [min]="config.typeConfig.min"
                       [decimalPlaces]="config.typeConfig.decimalPlaces"
                       [step]="config.typeConfig.step">

    </tanj-number-widget>
  </ng-container>
  <ng-container *ngIf="mode == viewModes.CONFIGURE">
    <tanj-number-configure
      [labelPosition]="config.labelPosition"
      [(label)]="config.label"
      [(value)]="ival.value"
      [(defaultValue)]="config.typeConfig.defaultValue"
      [(max)]="config.typeConfig.max"
      [(min)]="config.typeConfig.min"
      [(decimalPlaces)]="config.typeConfig.decimalPlaces"
      [(step)]="config.typeConfig.step">

    </tanj-number-configure>
  </ng-container>

                 `,
  encapsulation: ViewEncapsulation.None
})
export class NumberTemplateComponent implements OnInit, InputTemplateIF {

  @Input() config: NumberInputConfig
  @Input() ival: NumberIval
  @Input() mode = <InputViewMode>null

  @Output() change: EventEmitter<any> = new EventEmitter(false)

  viewModes = InputViewModes


  constructor(private _changeDetector: ChangeDetectorRef) {

  }

  ngOnInit(): void {
    Hacks.materialDesignPlaceholderText(this._changeDetector)
  }


}
