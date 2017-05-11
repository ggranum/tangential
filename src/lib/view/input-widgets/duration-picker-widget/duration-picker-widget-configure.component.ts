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
import {
  Hacks,
  TimeUnits
} from '@tangential/core'
import * as moment from 'moment'
import {DurationPickerState} from './duration-picker-state'


/**
 * Provider Expression that allows IconRatingWidget to register as a ControlValueAccessor.
 * This allows it to support [(ngModel)].
 * @docs-private
 */
export const TANJ_DURATION_WIDGET_CONFIG_CONTROL_VALUE_ACCESSOR: any = {
  provide:     NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => DurationPickerWidgetConfigureComponent),
  multi:       true
};

export class DurationPickerWidgetConfigureChange {
  constructor(public source: DurationPickerWidgetConfigureComponent, public value: number) {
  }
}


@Component({
  selector:      'tanj-duration-picker-widget-configure',
  template:      `<!--  -->
  <div class="tanj-input-template tanj-mode-configure" flex layout="column" layout-align="start">
    <md-input-container dividerColor="accent">
      <input mdInput
             class="tanj-input"
             type="text"
             maxlength="50"
             placeholder="Enter a label for this input"
             (change)="labelChange.emit(label)"
             [(ngModel)]="label"/>
    </md-input-container>

    <ng-container *ngIf="label">
      <fieldset flex layout="row" layout-align="start">
        <legend>For:</legend>
        <div flex class="tanj-choose-duration-fields-container" layout="column" layout-align="start">
          <md-checkbox *ngFor="let field of state.fields"
                       layout="row" layout-align="start"
                       [disabled]="!field.canToggleSelection()"
                       [labelPosition]="'before'"
                       [checked]="field.selected"
                       (change)="field.selected = $event.checked">
            {{field.unit.fullLabel}}
          </md-checkbox>
        </div>
      </fieldset>

      <tanj-duration-picker-widget
        [(value)]="defaultValue"
        (valueChange)="value = defaultValue; valueChange.emit(value); defaultValueChange.emit(defaultValue)"
        [defaultValue]="defaultValue"
        [showDays]="showDays"
        [showHours]="showHours"
        [showMinutes]="showMinutes"
        [showSeconds]="showSeconds"
        [showMilliseconds]="showMilliseconds"
        [max]="max"
        label="Default Value"
        [labelPosition]="'before'">
      </tanj-duration-picker-widget>
    </ng-container>

  </div>
                 `,
  providers:     [TANJ_DURATION_WIDGET_CONFIG_CONTROL_VALUE_ACCESSOR],
  encapsulation: ViewEncapsulation.None
})
export class DurationPickerWidgetConfigureComponent implements OnInit, OnChanges, ControlValueAccessor {


  @HostBinding('attr.flex') flex = '';
  @HostBinding('attr.layout') flexLayout = 'column';
  @HostBinding('attr.layout-align') flexLayoutAlign = 'start';

  @Input() value: number = 0
  @Output() valueChange: EventEmitter<number> = new EventEmitter(false)

  @Input() labelPosition: 'before' | 'after' | 'below' = 'before'
  @Input() disabled: boolean

  /**
   * Configuration Fields
   */
  @Input() label: string = ''
  @Output() labelChange: EventEmitter<string> = new EventEmitter(false)

  @Input() defaultValue: number = 0
  @Output() defaultValueChange: EventEmitter<number> = new EventEmitter(false)

  @Input() max: number
  @Output() maxChange: EventEmitter<number> = new EventEmitter(false)

  @Input() showDays: boolean = false
  @Output() showDaysChange: EventEmitter<boolean> = new EventEmitter(false)

  @Input() showHours: boolean = false
  @Output() showHoursChange: EventEmitter<boolean> = new EventEmitter(false)

  @Input() showMinutes: boolean = false
  @Output() showMinutesChange: EventEmitter<boolean> = new EventEmitter(false)

  @Input() showSeconds: boolean = false
  @Output() showSecondsChange: EventEmitter<boolean> = new EventEmitter(false)

  @Input() showMilliseconds: boolean = false
  @Output() showMillisecondsChange: EventEmitter<boolean> = new EventEmitter(false)

  /* end Configuration Fields */

  state: DurationPickerState = new DurationPickerState()

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

  ngOnChanges(changes: { value: SimpleChange }) {
    if (changes.value) {
      this.state.setDuration(moment.duration(this.value))
    }
    this.updateFields()
  }

  private updateFields() {
    if (this.showDays) {
      this.state.select(TimeUnits.day)
    }
    if (this.showHours) {
      this.state.select(TimeUnits.h)
    }
    if (this.showMinutes) {
      this.state.select(TimeUnits.min)
    }
    if (this.showSeconds) {
      this.state.select(TimeUnits.s)
    }
    if (this.showMilliseconds) {
      this.state.select(TimeUnits.ms)
    }
  }


  emitChangeEvent() {
    this.controlValueAccessorChangeFn(this.value);
    this.change.emit(new DurationPickerWidgetConfigureChange(this, this.value))
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

