import {
  ChangeDetectorRef, Component, EventEmitter, forwardRef, HostBinding, Input, OnChanges, OnInit, Output, ViewEncapsulation
} from '@angular/core'
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms'
import {Hacks} from '@tangential/core'


/**
 * Provider Expression that allows this widget to register as a ControlValueAccessor.
 * This allows it to support [(ngModel)].
 * @docs-private
 */
export const TANJ_NUMBER_SLIDER_WIDGET_VIEW_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => NumberSliderWidgetComponent), multi: true
};

export class NumberSliderWidgetChange {

  constructor(public source: NumberSliderWidgetComponent, public value: number) {
  }
}


@Component({
  selector: 'tanj-number-slider-widget', template: `<!-- -->
  <div flex class="tanj-input-template tanj-mode-edit"
       [ngClass]="{'tanj-disabled': disabled}"
       layout="row"
       layout-align="center center">
    <span *ngIf="!hideLabel && labelPosition == 'before'"
          class="tanj-label tanj-before">{{label}}</span>
    <div flex class="tanj-widget-input-container" layout="column" layout-align="start center">
      <div flex *ngIf="!onlyLabel" class="tanj-widget-input" layout="row" layout-align="start">
        <mat-slider flex
                   [disabled]="disabled"
                   [(ngModel)]="value"
                   (change)="valueChange.emit(value)"
                   [max]="max"
                   [min]="min"
                   [step]="step"
                   [thumbLabel]="true"
                   [tickInterval]="tickInterval"
                   [vertical]="vertical">
        </mat-slider>
        <mat-form-field flex="15"
                            class="tanj-number-slider-input-field tanj-widget-input"
                            dividerColor="accent"
                            layout="row"
                            layout-align="start">
          <input flex
                 matInput
                 class="tanj-input"
                 type="number"
                 max="{{max}}"
                 [disabled]="disabled"
                 [step]="step"
                 (change)="valueChange.emit(value)"
                 [(ngModel)]="value"/>
        </mat-form-field>
      </div>
      <span *ngIf="!hideLabel && labelPosition == 'below'" class="tanj-label tanj-below">{{label}}</span>
    </div>
    <span *ngIf="!hideLabel && labelPosition == 'after'" class="tanj-label tanj-after">{{label}}</span>
  </div>
            `, providers: [TANJ_NUMBER_SLIDER_WIDGET_VIEW_CONTROL_VALUE_ACCESSOR], encapsulation: ViewEncapsulation.None
})
export class NumberSliderWidgetComponent implements ControlValueAccessor, OnChanges, OnInit {

  // turn this into a class
  @HostBinding('attr.flex') flex = '';
  @HostBinding('attr.layout') flexLayout = 'column';
  @HostBinding('attr.layout-align') flexLayoutAlign = 'start';


  @Input() value: number = 0
  @Output() valueChange: EventEmitter<number> = new EventEmitter(false)

  @Input() labelPosition: 'before' | 'after' | 'below' = 'below'
  @Input() disabled: boolean
  @Input() hideLabel: boolean
  @Input() onlyLabel: boolean

  /**
   * Configuration Fields
   */
  @Input() label: string = ''
  @Input() defaultValue: number = 0
  @Input() max: number = 5
  @Input() min: number
  @Input() step: number
  @Input() decimalPlaces: number
  @Input() tickInterval: number
  @Input() vertical: boolean = false
  /* end Configuration Fields */

  @Output() change: EventEmitter<any> = new EventEmitter(false)

  onTouched: () => any = () => {
  };
  private controlValueAccessorChangeFn: (value: any) => void = (value) => {
  };


  constructor(private changeDetectorRef: ChangeDetectorRef) {
  }


  ngOnInit() {
    Hacks.materialDesignPlaceholderText(this.changeDetectorRef)
  }

  ngOnChanges(changes) {
  }

  handleValueChange(value: number) {
    if (!this.disabled) {
      this.value = value
      this.valueChange.emit(this.value)
      this.emitChangeEvent()
    }
  }

  /**
   * Boilerplate / required for Angular
   *
   */
  private emitChangeEvent() {
    const change = new NumberSliderWidgetChange(this, this.value)
    this.controlValueAccessorChangeFn(this.value);
    this.change.emit(change)
  }

  public writeValue(value: number): void {
    this.value = value
  }

  public registerOnChange(fn: any): void {
    this.controlValueAccessorChangeFn = fn;
  }

  public registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  /**
   * Sets the input's disabled state. Implemented as a part of ControlValueAccessor.
   * @param isDisabled Whether the input should be disabled.
   */
  setDisabledState(isDisabled: boolean) {
    this.disabled = isDisabled;
  }
}
