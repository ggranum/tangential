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
import {IconIF} from '@tangential/components'
import {Hacks} from '@tangential/core'


/**
 * Provider Expression that allows this widget to register as a ControlValueAccessor.
 * This allows it to support [(ngModel)].
 * @docs-private
 */
export const TANJ_ICON_RATING_WIDGET_VIEW_CONTROL_VALUE_ACCESSOR: any = {
  provide:     NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => IconRatingWidgetComponent),
  multi:       true
};

export class IconRatingWidgetChange {

  constructor(public source: IconRatingWidgetComponent, public value: number) {
  }
}


@Component({
  selector:      'tanj-icon-rating-widget',
  template:      `<!-- -->
  <div flex
       class="tanj-input-template tanj-mode-edit"
       [ngClass]="{'tanj-disabled': disabled}"
       layout="row"
       layout-align="center center">
    <span *ngIf="!hideLabel && labelPosition == 'before'"
          class="tanj-label tanj-icon-rating-widget-label">{{label}}</span>
    <div flex class="tanj-widget-input" layout="column" layout-align="start center">
      <div *ngIf="!onlyLabel"
           class="tanj-icon-rating-stars tanj-widget-input"
           layout="column"
           layout-align="start"
           (swipeRight)="swipeRight($event)"
           (swipeLeft)="swipeLeft($event)">

        <div flex class="tanj-icon-rating-icons-container" layout="row" layout-align="start">
          <tanj-icon *ngFor="let icon of icons; let idx = index" [icon]="icon" (click)="onIconClick(idx)"></tanj-icon>
        </div>

      </div>
      <span *ngIf="!hideLabel && labelPosition == 'below'" class="tanj-label tanj-below">{{label}}</span>
    </div>
    <span *ngIf="!hideLabel && labelPosition == 'after'" class="tanj-label tanj-after tanj-icon-rating-widget-label">{{label}}</span>
  </div>
                 `,
  providers:     [TANJ_ICON_RATING_WIDGET_VIEW_CONTROL_VALUE_ACCESSOR],
  encapsulation: ViewEncapsulation.None
})
export class IconRatingWidgetComponent implements ControlValueAccessor, OnInit, OnChanges {

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
  @Input() max: number = 5
  @Input() iconFont: string
  @Input() offIconNames: string[]
  @Input() onIconNames: string[]
  /* end Configuration Fields */

  @Output() change: EventEmitter<any> = new EventEmitter(false)

  icons: IconIF[]

  onTouched: () => any = () => { };
  private controlValueAccessorChangeFn: (value: any) => void = (value) => { };


  constructor(private changeDetectorRef: ChangeDetectorRef) {
  }


  ngOnInit() {
    Hacks.materialDesignPlaceholderText(this.changeDetectorRef)
  }

  ngOnChanges(changes: { config: SimpleChange, ival: SimpleChange }) {
    if (this.max && this.iconFont && this.offIconNames && this.onIconNames) {
      this.icons = []
      for (let i = 0; i < this.max; i++) {
        const icon: IconIF = {
          font: this.iconFont,
          name: i <= this.value ? this.onIconNames[0] : this.offIconNames[0]
          //                           star                 star_border
        }
        this.icons.push(icon)
      }
    }
  }


  onIconClick(idx) {
    if (!this.disabled) {
      this.value = idx
      this.valueChange.emit(this.value)
    }
  }


  swipeRight(event: any) {
  }

  swipeLeft(event: any) {
  }


  emitChangeEvent() {
    this.controlValueAccessorChangeFn(this.value);
    this.change.emit(new IconRatingWidgetChange(this, this.value))
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
