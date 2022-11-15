import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  forwardRef,
  HostBinding,
  Input,
  OnChanges,
  OnInit,
  Output, SimpleChanges,
  ViewEncapsulation
} from '@angular/core'
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms'
import {Hacks} from '@tangential/core'


/**
 * Provider Expression that allows this widget to register as a ControlValueAccessor.
 * This allows it to support [(ngModel)].
 * @docs-private
 */
export const TANJ_NUMBER_WIDGET_VIEW_CONTROL_VALUE_ACCESSOR: any = {
  provide:     NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => NumberWidgetComponent),
  multi:       true
};

export class NumberWidgetChange {

  constructor(public source: NumberWidgetComponent, public value: number) {
  }
}


@Component({
  selector:      'tanj-number-widget',
  template:      `<!-- -->
  <div flex class="tanj-input-template tanj-mode-edit"
       [ngClass]="{'tanj-disabled': disabled}"
       layout="row"
       layout-align="start center">
    <span *ngIf="!hideLabel && labelPosition == 'before'" class="tanj-label tanj-before">{{label}}</span>
    <div flex class="tanj-widget-input" layout="column" layout-align="center start">
      <div flex *ngIf="!onlyLabel" class="tanj-widget-input" layout="row" layout-align="start">
        <mat-form-field flex
                            class="tanj-number-input-field tanj-widget-input"
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
                 `,
  providers:     [TANJ_NUMBER_WIDGET_VIEW_CONTROL_VALUE_ACCESSOR],
  encapsulation: ViewEncapsulation.None
})
export class NumberWidgetComponent implements ControlValueAccessor, OnChanges, OnInit {

  // turn this into a class
  @HostBinding('attr.flex') flex = '';
  @HostBinding('attr.layout') flexLayout = 'column';
  @HostBinding('attr.layout-align') flexLayoutAlign = 'start';

  @Input() value: number = 0
  @Output() valueChange: EventEmitter<number> = new EventEmitter(false)

  @Input() labelPosition: 'before' | 'after' | 'below' = 'before'
  @Input() disabled: boolean = false
  @Input() hideLabel: boolean = false
  @Input() onlyLabel: boolean = false

  /**
   * Configuration Fields
   */
  @Input() label: string = ''
  @Input() defaultValue: number = 0
  @Input() max: number = 5
  @Input() min: number = 0
  @Input() step: number = 1
  @Input() decimalPlaces: number = 1
  @Input() tickInterval: number = 10
  @Input() vertical: boolean = false
  /* end Configuration Fields */

  @Output() change: EventEmitter<any> = new EventEmitter(false)

  onTouched: () => any = () => { };
  private controlValueAccessorChangeFn: (value: any) => void = (value) => { };

  constructor(private changeDetectorRef: ChangeDetectorRef) {
  }


  ngOnInit() {
    Hacks.materialDesignPlaceholderText(this.changeDetectorRef)
  }

  ngOnChanges(changes: SimpleChanges) {
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
    this.controlValueAccessorChangeFn(this.value);
    this.change.emit(new NumberWidgetChange(this, this.value))
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
