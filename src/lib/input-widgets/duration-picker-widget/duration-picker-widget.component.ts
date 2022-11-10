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
import {MatDialog} from '@angular/material'
import {
  Hacks,
  TimeUnits
} from '@tangential/core'
import * as moment from 'moment'
import {
  DurationPickerDialog,
  DurationPickerDialogResult
} from './duration-picker-dialog'
import {DurationPickerState} from './duration-picker-state'


/**
 * Provider Expression that allows this widget to register as a ControlValueAccessor.
 * This allows it to support [(ngModel)].
 * @docs-private
 */
export const TANJ_DURATION_PICKER_WIDGET_VIEW_CONTROL_VALUE_ACCESSOR: any = {
  provide:     NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => DurationPickerWidgetComponent),
  multi:       true
};

export class DurationPickerWidgetChange {

  constructor(public source: DurationPickerWidgetComponent, public value: number) {
  }
}


export interface DurationFieldConfig {
  unitKey: string
  showing: boolean
  showingNext: boolean
  separator?: string
  label: string
  max: number
  value: number
}
@Component({
  selector:      'tanj-duration-picker-widget',
  template:      `<!-- -->
  <div flex
       class="tanj-input-template tanj-mode-edit"
       [ngClass]="{'tanj-disabled': disabled}"
       layout="row"
       layout-align="start center"
       (click)="showEditDialog()">
      <span *ngIf="!hideLabel && labelPosition == 'before'"
            class="tanj-label tanj-icon-rating-widget-label">{{label}}</span>
    <div flex class="tanj-widget-input" layout="column" layout-align="start center">
      <div *ngIf="!onlyLabel"
           class="tanj-widget-input"
           layout="row"
           layout-align="start">

        <ng-container *ngFor="let field of state.fields">
          <span *ngIf="field.selected">{{field.value | number:'2.0-0'}}<span 
            *ngIf="field.next?.selected">{{field.separator || ':'}}</span></span>
        </ng-container>

      </div>
      <span *ngIf="!hideLabel && labelPosition == 'below'" class="tanj-label tanj-below">{{label}}</span>
    </div>
    <span *ngIf="!hideLabel && labelPosition == 'after'" class="tanj-label tanj-after tanj-icon-rating-widget-label">{{label}}</span>
  </div>

                 `,
  providers:     [TANJ_DURATION_PICKER_WIDGET_VIEW_CONTROL_VALUE_ACCESSOR],
  encapsulation: ViewEncapsulation.None
})
export class DurationPickerWidgetComponent implements OnInit, OnChanges, ControlValueAccessor {

  // turn this into a class
  @HostBinding('attr.flex') flex = '';
  @HostBinding('attr.layout') flexLayout = 'column';
  @HostBinding('attr.layout-align') flexLayoutAlign = 'start';

  @Input() value: number = 0
  @Output() valueChange: EventEmitter<number> = new EventEmitter(false)

  @Input() labelPosition: 'before' | 'after' | 'below' = 'before'
  @Input() disabled: boolean
  @Input() hideLabel: boolean
  @Input() onlyLabel: boolean

  /**
   * Configuration Fields
   */
  @Input() label: string = ''
  @Input() defaultValue: number = 0
  /* end Configuration Fields */

  @Input() max: number

  @Input() showDays: boolean = false
  @Input() showHours: boolean = false
  @Input() showMinutes: boolean = false
  @Input() showSeconds: boolean = false
  @Input() showMilliseconds: boolean = false

  @Output() change: EventEmitter<any> = new EventEmitter(false)

  state: DurationPickerState = new DurationPickerState()

  onTouched: () => any = () => { };
  private controlValueAccessorChangeFn: (value: any) => void = (value) => { };

  constructor(private changeDetectorRef: ChangeDetectorRef, private dialog: MatDialog) {
  }

  ngOnInit() {
    Hacks.materialDesignPlaceholderText(this.changeDetectorRef)
  }


  public ngOnChanges(changes: { value: SimpleChange }): void {
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


  showEditDialog() {
    const dialogRef = this.dialog.open(DurationPickerDialog, {
      disableClose: true,
      data:         {state: this.state}
    })
    dialogRef.afterClosed().subscribe((result: DurationPickerDialogResult) => {
      if (result.success) {
        this.value = result.millis
        this.changeDetectorRef.detectChanges()
        this.emitChangeEvent()
      }
    })
  }


  private emitChangeEvent() {
    this.controlValueAccessorChangeFn(this.value);
    this.change.emit(new DurationPickerWidgetChange(this, this.value))
    this.valueChange.emit(this.value)
    console.log('DurationPickerWidgetComponent', 'emitChangeEvent')
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

