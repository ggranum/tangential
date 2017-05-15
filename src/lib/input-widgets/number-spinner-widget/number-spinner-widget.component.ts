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
export const TANJ_NUMBER_SPINNER_WIDGET_VIEW_CONTROL_VALUE_ACCESSOR: any = {
  provide:     NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => NumberSpinnerWidgetComponent),
  multi:       true
};

export class NumberSpinnerWidgetChange {

  constructor(public source: NumberSpinnerWidgetComponent, public value: number) {
  }
}


@Component({
  selector:      'tanj-number-spinner-widget',
  template:      `<!-- -->
  <div flex
       class="tanj-input-template tanj-mode-edit"
       [ngClass]="{'tanj-disabled': disabled}"
       layout="row" layout-align="center center">
    <span *ngIf="!hideLabel && labelPosition == 'before'" class="tanj-label tanj-before  tanj-number-spinner-label">{{label}}</span>
    <div flex class="tanj-widget-input" layout="column" layout-align="start center">
      <div *ngIf="!onlyLabel"
           class="tanj-input-spinner-field"
           layout="column"
           layout-align="start"
           (swipeUp)="swipeUp($event)"
           (swipeDown)="swipeDown($event)">
        <tanj-icon align="center"
                   font="material-icons"
                   ligature="arrow_drop_up"
                   (click)="$event.stopPropagation(); $event.preventDefault(); onNextValueRequest()"></tanj-icon>
        <div class="tanj-spinner-value tanj-previous ">{{previousValue() | number:'1.0-0'}}</div>
        <div *ngIf="!keyboardInputToggled"
             class="tanj-spinner-value tanj-current"
             (click)="onKeyboardInputRequest($event)">{{value | number:'1.0-0'}}
        </div>
        <input *ngIf="keyboardInputToggled"
               class="tanj-spinner-value tanj-current tanj-spinner-keyboard-input-toggled tanj-raw-input tanj-number"
               type="number"
               min="{{min}}"
               max="{{max}}"
               step="{{step}}"
               [(ngModel)]="value"
               autofocus
               (blur)="keyboardInputToggled = false">
        <div class="tanj-spinner-value tanj-next">{{nextValue() | number:'1.0-0'}}</div>
        <tanj-icon align="center"
                   font="material-icons"
                   ligature="arrow_drop_down"
                   (click)="$event.stopPropagation(); $event.preventDefault(); onPreviousValueRequest()"></tanj-icon>
      </div>
      <span *ngIf="!hideLabel && labelPosition == 'below'" class="tanj-label tanj-below  tanj-number-spinner-label">{{label}}</span>
    </div>
    <span *ngIf="!hideLabel && labelPosition == 'after'"
          class="tanj-label tanj-after  tanj-number-spinner-label">{{label}}</span>
  </div>
                 `,
  providers:     [TANJ_NUMBER_SPINNER_WIDGET_VIEW_CONTROL_VALUE_ACCESSOR],
  encapsulation: ViewEncapsulation.None
})
export class NumberSpinnerWidgetComponent implements OnInit, OnChanges, ControlValueAccessor {

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
  @Input() max: number = 10
  @Input() min: number = 0
  @Input() step: number = 1
  /* end Configuration Fields */

  @Output() change: EventEmitter<any> = new EventEmitter(false)

  keyboardInputToggled = false

  onTouched: () => any = () => { };
  private controlValueAccessorChangeFn: (value: any) => void = (value) => { };

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


  onPreviousValueRequest() {
    if (!this.disabled) {
      const v = this.previousValue()
      if (v !== null) {
        this.handleValueChange(v)
      }
    }
  }

  onNextValueRequest() {
    if (!this.disabled) {
      const v = this.nextValue()
      if (v !== null) {
        this.handleValueChange(v)
      }
    }
  }

  nextValue(): number {
    let v = this.value + this.step
    if (v > this.max) {
      v = null
    }
    return v
  }

  previousValue(): number {
    let v = this.value - this.step
    if (v < this.min) {
      v = null
    }
    return v
  }

  swipeUp(event: any) {
    this.onNextValueRequest()
  }

  swipeDown(event: any) {
    this.onPreviousValueRequest()
  }

  onKeyboardInputRequest(event) {
    this.keyboardInputToggled = this.disabled ? false : !this.keyboardInputToggled
  }


  /**
   * Boilerplate / required for Angular
   */
  private emitChangeEvent() {
    this.controlValueAccessorChangeFn(this.value);
    this.change.emit(new NumberSpinnerWidgetChange(this, this.value))
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
