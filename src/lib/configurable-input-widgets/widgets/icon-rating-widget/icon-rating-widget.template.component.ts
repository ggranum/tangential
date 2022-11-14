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
import {NumberIval} from '../../data-type/number/number-ival'
import {InputViewMode, InputViewModes} from '../../support/input-view-mode'
//noinspection ES6PreferShortImport
import {InputTemplateIF} from '../../support/template-components/input-template-component/input-template.component'
import {IconRatingWidgetConfig} from './icon-rating-widget-config'


@Component({
  selector:      'tanj-icon-rating-widget-template',
  template:      `
                   <ng-container *ngIf="mode == viewModes.VIEW || mode == viewModes.PREVIEW || mode == viewModes.EDIT  ">
                     <tanj-icon-rating-widget
                       [labelPosition]="config.labelPosition"
                       [disabled]=" mode == viewModes.PREVIEW || config.disabled"
                       [(value)]="ival.value"
                       [label]="config.label"
                       [defaultValue]="config.typeConfig.defaultValue"
                       [max]="config.typeConfig.max"
                       [iconFont]="config.iconFont"
                       [offIconNames]="config.offIconNames"
                       [onIconNames]="config.onIconNames">
                     </tanj-icon-rating-widget>
                   </ng-container>
                   <ng-container *ngIf="mode == viewModes.CONFIGURE">
                     <tanj-icon-rating-widget-configure
                       [labelPosition]="config.labelPosition"
                       [disabled]="config.disabled"
                       [(value)]="ival.value"
                       [(label)]="config.label"
                       [(defaultValue)]="config.typeConfig.defaultValue"
                       [(max)]="config.typeConfig.max"
                       [(iconFont)]="config.iconFont"
                       [(offIconNames)]="config.offIconNames"
                       [(onIconNames)]="config.onIconNames">
                     </tanj-icon-rating-widget-configure>
                   </ng-container>
                 `,
  encapsulation: ViewEncapsulation.None
})
export class IconRatingWidgetTemplateComponent implements OnInit, InputTemplateIF {

  @HostBinding('attr.flex') flex = '';
  @HostBinding('attr.layout') flexLayout = 'column';
  @HostBinding('attr.layout-align') flexLayoutAlign = 'start';

  /* Support for dynamic use. */
  @Input() config: IconRatingWidgetConfig
  /* Support for dynamic use. */
  @Input() ival: NumberIval

  @Input() mode = <InputViewMode> InputViewModes.VIEW
  @Output() change: EventEmitter<any> = new EventEmitter(false)

  viewModes = InputViewModes

  constructor(private changeDetectorRef: ChangeDetectorRef) {
  }


  ngOnInit() {
    Hacks.materialDesignPlaceholderText(this.changeDetectorRef)
  }


  emitChangeEvent() {
    this.change.emit()
  }

}
