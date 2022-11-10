import {
  ChangeDetectorRef, Component, EventEmitter, forwardRef, HostBinding, Input, OnChanges, OnInit, Output, SimpleChange, ViewEncapsulation
} from '@angular/core'
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms'
import {Hacks} from '@tangential/core'
import * as moment from 'moment'


/**
 * Provider Expression that allows this widget to register as a ControlValueAccessor.
 * This allows it to support [(ngModel)].
 * @docs-private
 */
export const TANJ_DATE_TIME_WIDGET_VIEW_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => DateTimeWidgetComponent), multi: true
};

export class DateTimeWidgetChange {

  constructor(public source: DateTimeWidgetComponent, public value: number) {
  }
}


@Component({
  selector: 'tanj-date-time-widget', template: `<!-- -->
  <div flex class="tanj-input-template tanj-mode-edit"
       [ngClass]="{'tanj-disabled': disabled}"
       layout="row"
       layout-align="start center">
    <span *ngIf="!hideLabel && labelPosition == 'before'" class="tanj-label tanj-before">{{label}}</span>
    <div flex class="tanj-widget-input" layout="column" layout-align="center start">
      <div flex *ngIf="!onlyLabel" class="tanj-widget-input" layout="row" layout-align="start">
        <mat-form-field flex
                            class="tanj-date-time-input-field tanj-widget-input"
                            dividerColor="accent"
                            layout="row"
                            layout-align="start">
          <input flex
                 matInput
                 class="tanj-input"
                 type="datetime-local"
                 minlength="{{minLength}}"
                 maxlength="{{maxLength}}"
                 [disabled]="disabled"
                 (change)="valueChange.emit(value)"
                 [(ngModel)]="dateInputValue"/>
        </mat-form-field>
      </div>
      <span *ngIf="!hideLabel && labelPosition == 'below'" class="tanj-label tanj-below">{{label}}</span>
    </div>
    <span *ngIf="!hideLabel && labelPosition == 'after'" class="tanj-label tanj-after">{{label}}</span>
  </div>
            `, providers: [TANJ_DATE_TIME_WIDGET_VIEW_CONTROL_VALUE_ACCESSOR], encapsulation: ViewEncapsulation.None
})
export class DateTimeWidgetComponent implements ControlValueAccessor, OnChanges, OnInit {

  // turn this into a class
  @HostBinding('attr.flex') flex = '';
  @HostBinding('attr.layout') flexLayout = 'column';
  @HostBinding('attr.layout-align') flexLayoutAlign = 'start';

  @Input() value: number = Date.now()
  @Output() valueChange: EventEmitter<number> = new EventEmitter(false)

  @Input() labelPosition: 'before' | 'after' | 'below' = 'before'
  @Input() disabled: boolean
  @Input() hideLabel: boolean
  @Input() onlyLabel: boolean

  /**
   * Configuration Fields
   */
  @Input() label: string = ''
  @Input() defaultToNow: boolean = false
  @Input() defaultValue: number = 0
  @Input() maxLength: number = 100
  @Input() minLength: number = 0
  /* end Configuration Fields */

  @Output() change: EventEmitter<any> = new EventEmitter(false)
  onTouched: () => any = () => {
  };

  constructor(private changeDetectorRef: ChangeDetectorRef) {
  }

  private controlValueAccessorChangeFn: (value: any) => void = (value) => {
  };


  ngOnInit() {
    this.value = this.defaultToNow ? Date.now() : this.defaultValue
    Hacks.materialDesignPlaceholderText(this.changeDetectorRef)
  }

  get dateInputValue(): string {
    return moment(this.value).format('YYYY-MM-DDTHH:mm:ss')
  }

  set dateInputValue(dateString: string) {
    this.value = moment(dateString).valueOf()
  }

  ngOnChanges(changes: { defaultToNow: SimpleChange }) {
    if (changes.defaultToNow && !this.value) {
      this.value = this.defaultToNow ? Date.now() : this.defaultValue
    }
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
    const change = new DateTimeWidgetChange(this, this.value)
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
