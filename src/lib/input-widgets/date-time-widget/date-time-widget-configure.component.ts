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
export const TANJ_DATE_TIME_WIDGET_CONFIG_CONTROL_VALUE_ACCESSOR: any = {
  provide:     NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => DateTimeWidgetConfigureComponent),
  multi:       true
};

export class DateTimeWidgetConfigureChange {
  constructor(public source: DateTimeWidgetConfigureComponent, public value: number) {
  }
}


@Component({
  selector:      'tanj-date-time-configure',
  template:      `<!-- -->
  <div class="tanj-input-template tanj-mode-configure" flex layout="column" layout-align="start">
    <mat-form-field dividerColor="accent">
      <input matInput class="tanj-input" type="text" maxlength="50" placeholder="Enter a label for this input"
             (change)="labelChange.emit(label)"
             [(ngModel)]="label"/>
    </mat-form-field>
    <ng-container *ngIf="label">
      <mat-slide-toggle class="tanj-input" [labelPosition]="'before'" [(ngModel)]="defaultToNow">Default to current time?
      </mat-slide-toggle>
      <tanj-date-time-widget *ngIf="!defaultToNow" [(value)]="defaultValue"
                            (valueChange)="value = defaultValue; emitChangeEvent(true, false)"
                            [defaultValue]="defaultValue"
                            label="Default Value"></tanj-date-time-widget>
    </ng-container>
  </div>
                 `,
  providers:     [TANJ_DATE_TIME_WIDGET_CONFIG_CONTROL_VALUE_ACCESSOR],
  encapsulation: ViewEncapsulation.None
})
export class DateTimeWidgetConfigureComponent implements OnInit, OnChanges, ControlValueAccessor {


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
  @Output() labelChange: EventEmitter<string> = new EventEmitter(false)

  @Input() defaultValue: number = Date.now()
  @Output() defaultValueChange: EventEmitter<number> = new EventEmitter(false)

  @Input() defaultToNow: boolean = false
  @Output() defaultToNowChange: EventEmitter<boolean> = new EventEmitter(false)

  @Output() change: EventEmitter<any> = new EventEmitter(false)

  /**
   * Called when the spinner is blurred. Needed to properly implement ControlValueAccessor.
   * @docs-private
   */
  onTouched: () => any = () => { };
  private controlValueAccessorChangeFn: (value: any) => void = (value) => { };


  constructor(private changeDetectorRef: ChangeDetectorRef) {
  }


  ngOnInit() {
    Hacks.materialDesignPlaceholderText(this.changeDetectorRef)
  }

  ngOnChanges(changes: { config: SimpleChange, ival: SimpleChange }) {
  }

  emitChangeEvent(value: boolean, label: boolean) {
    this.controlValueAccessorChangeFn(this.value);
    this.change.emit(new DateTimeWidgetConfigureChange(this, this.value))
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
