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
import {NumberSpinnerConfig} from './number-spinner-config'
@Component({
  template:      `<!-- -->
  <ng-container *ngIf="mode == viewModes.VIEW || mode == viewModes.PREVIEW || mode == viewModes.EDIT  ">
    <tanj-number-spinner-widget [labelPosition]="config.labelPosition"
                               [disabled]="mode === viewModes.PREVIEW || config.disabled"
                               [label]="config.label"
                               [(value)]="ival.value"
                               [max]="config.typeConfig.max"
                               [min]="config.typeConfig.min"
                               [step]="config.typeConfig.step">

    </tanj-number-spinner-widget>
  </ng-container>
  <ng-container *ngIf="mode == viewModes.CONFIGURE">
    <tanj-number-spinner-configure
      [labelPosition]="config.labelPosition"
      [(label)]="config.label"
      [(value)]="ival.value"
      [(defaultValue)]="config.typeConfig.defaultValue"
      [(max)]="config.typeConfig.max"
      [(min)]="config.typeConfig.min"
      [(step)]="config.typeConfig.step">

    </tanj-number-spinner-configure>
  </ng-container>

                 `,
  encapsulation: ViewEncapsulation.None
})
export class NumberSpinnerTemplateComponent implements OnInit, InputTemplateIF {

  @Input() config: NumberSpinnerConfig
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
