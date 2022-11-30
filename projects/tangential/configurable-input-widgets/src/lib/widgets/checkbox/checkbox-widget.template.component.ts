import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostBinding,
  Input,
  OnInit,
  Output,
  ViewEncapsulation
} from '@angular/core'
import {Hacks} from '@tangential/core'
//noinspection ES6PreferShortImport
import {BooleanIval} from '../../data-type/boolean/boolean-ival'
import {
  InputViewMode,
  InputViewModes
} from '../../support/input-view-mode'
//noinspection ES6PreferShortImport
import {InputTemplateIF} from '../../support/template-components/input-template-component/input-template.component'
import {CheckboxWidgetConfig} from './checkbox-widget-config'


@Component({
  selector:      'tanj-checkbox-widget-template',
  template:      `
                   <ng-container *ngIf="mode == viewModes.VIEW || mode == viewModes.PREVIEW || mode == viewModes.EDIT  ">
                     <tanj-checkbox-widget
                       [labelPosition]="config.labelPosition"
                       [disabled]=" mode == viewModes.PREVIEW || config.disabled"
                       [(value)]="ival.value"
                       [label]="config.label"
                       [defaultValue]="config.typeConfig.defaultValue">
                     </tanj-checkbox-widget>
                   </ng-container>
                   <ng-container *ngIf="mode == viewModes.CONFIGURE">
                     <tanj-checkbox-widget-configure
                       [labelPosition]="config.labelPosition"
                       [disabled]="config.disabled"
                       [(value)]="ival.value"
                       [(label)]="config.label"
                       [(defaultValue)]="config.typeConfig.defaultValue">
                     </tanj-checkbox-widget-configure>
                   </ng-container>
                 `,
  encapsulation: ViewEncapsulation.None
})
export class CheckboxWidgetTemplateComponent implements OnInit, InputTemplateIF {

  @HostBinding('attr.flex') flex = '';
  @HostBinding('attr.layout') flexLayout = 'column';
  @HostBinding('attr.layout-align') flexLayoutAlign = 'start';

  /* Support for dynamic use. */
  @Input() config: CheckboxWidgetConfig
  /* Support for dynamic use. */
  @Input() ival: BooleanIval

  @Input() mode = <InputViewMode> InputViewModes.VIEW
  @Output() change: EventEmitter<any> = new EventEmitter(false)

  viewModes = InputViewModes

  constructor(private changeDetectorRef: ChangeDetectorRef) {
  }

  ngOnInit() {
    Hacks.materialDesignPlaceholderText(this.changeDetectorRef)
  }

}
