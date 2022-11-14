import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  forwardRef,
  HostBinding,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChange,
  ViewEncapsulation
} from '@angular/core'
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR
} from '@angular/forms'
import {Hacks} from '@tangential/core'


/**
 * Provider Expression that allows this widget to register as a ControlValueAccessor.
 * This allows it to support [(ngModel)].
 * @docs-private
 */
export const TANJ_NUMBER_SPINNER_WIDGET_CONFIG_CONTROL_VALUE_ACCESSOR: any = {
  provide:     NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => NumberSpinnerWidgetConfigureComponent),
  multi:       true
};

export class NumberSpinnerWidgetConfigureChange {
  constructor(public source: NumberSpinnerWidgetConfigureComponent, public value: number) {
  }
}


@Component({
  selector:      'tanj-number-spinner-configure',
  template:      `<!-- -->
  <div class="tanj-input-template tanj-mode-configure" flex layout="column" layout-align="start">
    <mat-form-field dividerColor="accent">
      <input matInput class="tanj-input" type="text" maxlength="50" placeholder="Enter a label for this input"
             (change)="labelChange.emit(label)"
             [(ngModel)]="label"/>
    </mat-form-field>
    <ng-container *ngIf="label">
      <tanj-number-spinner-widget [(value)]="defaultValue"
                                 (valueChange)="value = defaultValue; emitChangeEvent(true, false)"
                                 [defaultValue]="defaultValue"
                                 [max]="max"
                                 [min]="min"
                                 [step]="step"
                                 label="Default Value"></tanj-number-spinner-widget>
      <mat-form-field dividerColor="accent">
        <input matInput
               class="tanj-input"
               type="number"
               placeholder="Min"
               (change)="minChange.emit(min)"
               [(ngModel)]="min"/>
      </mat-form-field>
      <mat-form-field dividerColor="accent">
        <input matInput
               class="tanj-input"
               type="number"
               placeholder="Max"
               (change)="maxChange.emit(max)"
               [(ngModel)]="max"/>
      </mat-form-field>
      <mat-form-field dividerColor="accent">
        <input matInput
               class="tanj-input"
               type="number"
               placeholder="Step"
               (change)="stepChange.emit(step)"
               [(ngModel)]="step"/>
      </mat-form-field>
    </ng-container>

  </div>
                 `,
  providers:     [TANJ_NUMBER_SPINNER_WIDGET_CONFIG_CONTROL_VALUE_ACCESSOR],
  encapsulation: ViewEncapsulation.None
})
export class NumberSpinnerWidgetConfigureComponent implements OnInit, OnChanges, ControlValueAccessor {


  @HostBinding('attr.flex') flex = '';
  @HostBinding('attr.layout') flexLayout = 'column';
  @HostBinding('attr.layout-align') flexLayoutAlign = 'start';

  @Input() value: number = 0
  @Output() valueChange: EventEmitter<number> = new EventEmitter(false)

  @Input() labelPosition: 'before' | 'after' | 'below' = 'before'
  @Input() disabled: boolean = false

  /**
   * Configuration Fields
   */
  @Input() label: string = ''
  @Input() defaultValue: number = 0
  @Input() max: number = 10
  @Input() min: number = 0
  @Input() step: number = 1

  @Output() labelChange: EventEmitter<string> = new EventEmitter(false)
  @Output() defaultValueChange: EventEmitter<number> = new EventEmitter(false)
  @Output() decimalChange: EventEmitter<number> = new EventEmitter(false)
  @Output() maxChange: EventEmitter<number> = new EventEmitter(false)
  @Output() minChange: EventEmitter<number> = new EventEmitter(false)
  @Output() stepChange: EventEmitter<number> = new EventEmitter(false)


  @Output() change: EventEmitter<any> = new EventEmitter(false)

  constructor(private changeDetectorRef: ChangeDetectorRef) {
  }

  /**
   * Called when the spinner is blurred. Needed to properly implement ControlValueAccessor.
   * @docs-private
   */
  onTouched: () => any = () => {
  };
  private controlValueAccessorChangeFn: (value: any) => void = (value) => {
  };

  ngOnInit() {
    Hacks.materialDesignPlaceholderText(this.changeDetectorRef)
  }

  ngOnChanges(changes: { config: SimpleChange, ival: SimpleChange }) {
  }

  emitChangeEvent(value: boolean, label: boolean) {
    this.controlValueAccessorChangeFn(this.value);
    this.change.emit(new NumberSpinnerWidgetConfigureChange(this, this.value))
    if (value) {
      this.valueChange.emit(this.value);
      this.defaultValueChange.emit(this.defaultValue)
    }
    if (label) {
      this.labelChange.emit(this.label)
    }
  }

  /**
   * Boilerplate / required for Angular
   *
   */
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
