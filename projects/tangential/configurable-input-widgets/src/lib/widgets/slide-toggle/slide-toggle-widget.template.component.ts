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
import {BooleanType} from '../../data-type'
//noinspection ES6PreferShortImport
import {BooleanIval} from '../../data-type/boolean/boolean-ival'
import {InputViewMode, InputViewModes} from '../../support/input-view-mode'
//noinspection ES6PreferShortImport
import {InputTemplateIF} from '../../support/template-components/input-template-component/input-template.component'
import {SlideToggleConfig} from './slide-toggle-widget-config'


@Component({
  selector:      'tanj-slide-toggle-widget-template',
  template:      `
                   <ng-container *ngIf="mode == viewModes.VIEW || mode == viewModes.PREVIEW || mode == viewModes.EDIT  ">
                     <tanj-slide-toggle-widget
                       [labelPosition]="config.labelPosition"
                       [disabled]=" mode == viewModes.PREVIEW || config.disabled"
                       [(value)]="ival.value"
                       [label]="config.label"
                       [defaultValue]="config.typeConfig.defaultValue">
                     </tanj-slide-toggle-widget>
                   </ng-container>
                   <ng-container *ngIf="mode == viewModes.CONFIGURE">
                     <tanj-slide-toggle-widget-configure
                       [labelPosition]="config.labelPosition"
                       [disabled]="config.disabled"
                       [(value)]="ival.value"
                       [(label)]="config.label"
                       [(defaultValue)]="config.typeConfig.defaultValue">
                     </tanj-slide-toggle-widget-configure>
                   </ng-container>
                 `,
  encapsulation: ViewEncapsulation.None
})
export class SlideToggleWidgetTemplateComponent implements OnInit, InputTemplateIF {

  @HostBinding('attr.flex') flex = '';
  @HostBinding('attr.layout') flexLayout = 'column';
  @HostBinding('attr.layout-align') flexLayoutAlign = 'start';

  /* Support for dynamic use. */
  @Input() config: SlideToggleConfig | undefined
  /* Support for dynamic use. */
  @Input() ival: BooleanIval = BooleanType.create({})

  @Input() mode = <InputViewMode> InputViewModes.VIEW
  @Output() change: EventEmitter<any> = new EventEmitter(false)

  viewModes = InputViewModes

  constructor(private changeDetectorRef: ChangeDetectorRef) {
  }


  ngOnInit() {
    Hacks.materialDesignPlaceholderText(this.changeDetectorRef)
  }
}
