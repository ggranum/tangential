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
import {TextIval} from '../../data-type/text/text-ival'
import {
  InputViewMode,
  InputViewModes
} from '../../support/input-view-mode'
//noinspection ES6PreferShortImport
import {InputTemplateIF} from '../../support/template-components/input-template-component/input-template.component'
import {TextInputConfig} from './text-input-config'
@Component({
  template:      `<!-- -->
  <ng-container *ngIf="mode == viewModes.VIEW || mode == viewModes.PREVIEW || mode == viewModes.EDIT  ">
    <tanj-text-widget [labelPosition]="config.labelPosition"
                     [disabled]="mode === viewModes.PREVIEW || config.disabled"
                     [label]="config.label"
                     [(value)]="ival.value"
                     [maxLength]="config.typeConfig.maxLength"
                     [minLength]="config.typeConfig.minLength">

    </tanj-text-widget>
  </ng-container>
  <ng-container *ngIf="mode == viewModes.CONFIGURE">
    <tanj-text-configure
      [labelPosition]="config.labelPosition"
      [(label)]="config.label"
      [(value)]="ival.value"
      [(defaultValue)]="config.typeConfig.defaultValue"
      [(maxLength)]="config.typeConfig.maxLength"
      [(minLength)]="config.typeConfig.minLength">
    </tanj-text-configure>
  </ng-container>

                 `,
  encapsulation: ViewEncapsulation.None
})
export class TextTemplateComponent implements OnInit, InputTemplateIF {

  @Input() config?: TextInputConfig
  @Input() ival: TextIval = new TextIval()
  @Input() mode: InputViewMode = InputViewModes.VIEW

  @Output() change: EventEmitter<any> = new EventEmitter(false)

  viewModes = InputViewModes


  constructor(private _changeDetector: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    Hacks.materialDesignPlaceholderText(this._changeDetector)
  }
}
