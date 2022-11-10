import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  forwardRef,
  HostBinding,
  Input,
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
 * Provider Expression that allows IconRatingWidget to register as a ControlValueAccessor.
 * This allows it to support [(ngModel)].
 * @docs-private
 */
export const TANJ_ICON_RATING_WIDGET_CONFIG_CONTROL_VALUE_ACCESSOR: any = {
  provide:     NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => IconRatingWidgetConfigureComponent),
  multi:       true
};

export class IconRatingWidgetConfigureChange {
  constructor(public source: IconRatingWidgetConfigureComponent, public value: number) {
  }
}


@Component({
  selector:      'tanj-icon-rating-widget-configure',
  template:      `<!-- -->
  <div class="tanj-input-template tanj-mode-configure" flex layout="column" layout-align="start">
    <mat-form-field dividerColor="accent">
      <input matInput
             class="tanj-input"
             type="text"
             maxlength="50"
             placeholder="Enter a label for this input"
             (change)="labelChange.emit(label)"
             [(ngModel)]="label"/>
    </mat-form-field>
    <ng-container *ngIf="label">
      <tanj-icon-rating-widget
        [(value)]="defaultValue"
        (valueChange)="value = defaultValue; valueChange.emit(value); defaultValueChange.emit(defaultValue)"
        [defaultValue]="defaultValue"
        [max]="max"
        [iconFont]="iconFont"
        [offIconNames]="offIconNames"
        [onIconNames]="onIconNames"
        label="Default Value"
        [labelPosition]="'before'">

      </tanj-icon-rating-widget>
      <mat-form-field dividerColor="accent">
        <input matInput
               class="tanj-input"
               type="number"
               placeholder="Max Rating"
               max="10"
               (change)="maxChange.emit(max)"
               [(ngModel)]="max"/>
      </mat-form-field>
    </ng-container>
  </div>
                 `,
  providers:     [TANJ_ICON_RATING_WIDGET_CONFIG_CONTROL_VALUE_ACCESSOR],
  encapsulation: ViewEncapsulation.None
})
export class IconRatingWidgetConfigureComponent implements OnInit, ControlValueAccessor {

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
  @Input() defaultValue: number = 0
  @Input() max: number = 5
  @Input() iconFont: string
  @Input() offIconNames: string[]
  @Input() onIconNames: string[]

  @Output() labelChange: EventEmitter<string> = new EventEmitter(false)
  @Output() defaultValueChange: EventEmitter<number> = new EventEmitter(false)
  @Output() maxChange: EventEmitter<number> = new EventEmitter(false)
  @Output() iconFontChange: EventEmitter<number> = new EventEmitter(false)
  @Output() offIconNamesChange: EventEmitter<number> = new EventEmitter(false)
  @Output() onIconNamesChange: EventEmitter<number> = new EventEmitter(false)
  /* end Configuration Fields */

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

  emitChangeEvent() {
    this.controlValueAccessorChangeFn(this.value);
    this.change.emit(new IconRatingWidgetConfigureChange(this, this.value))
  }


  swipeRight(event: any) {
  }

  swipeLeft(event: any) {
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
