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
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms'
import {Hacks} from '@tangential/core'

/**
 * Provider Expression that allows this widget to register as a ControlValueAccessor.
 * This allows it to support [(ngModel)].
 * @docs-private
 */
export const TANJ_SLIDE_TOGGLE_WIDGET_VIEW_CONTROL_VALUE_ACCESSOR: any = {
  provide:     NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SlideToggleWidgetComponent),
  multi:       true
};

export class SlideToggleWidgetChange {

  constructor(public source: SlideToggleWidgetComponent, public value: boolean) {
  }
}


@Component({
  selector:      'tanj-slide-toggle-widget',
  template:      `<!-- -->
  <div flex class="tanj-input-template tanj-mode-edit"
       [ngClass]="{'tanj-disabled': disabled}"
       layout="row"
       layout-align="center center">
    <span *ngIf="!hideLabel && labelPosition == 'before'"
          class="tanj-label tanj-slide-toggle-widget-label">{{label}}</span>
    <div flex layout="column" layout-align="start center">
      <div *ngIf="!onlyLabel"
           class="tanj-widget-input"
           layout="column"
           layout-align="start">
        <mat-slide-toggle flex
                         [disabled]="disabled"
                         [(ngModel)]="value"
                         (change)="handleValueChange(value)">
        </mat-slide-toggle>
      </div>
      <div *ngIf="!hideLabel && labelPosition == 'below'" class="tanj-label tanj-below">{{label}}</div>
    </div>
    <span *ngIf="!hideLabel && labelPosition == 'after'" class="tanj-label tanj-slide-toggle-widget-label">{{label}}</span>
  </div>
                 `,
  providers:     [TANJ_SLIDE_TOGGLE_WIDGET_VIEW_CONTROL_VALUE_ACCESSOR],
  encapsulation: ViewEncapsulation.None
})
export class SlideToggleWidgetComponent implements ControlValueAccessor, OnChanges, OnInit {

  // turn this into a class
  @HostBinding('attr.flex') flex = '';
  @HostBinding('attr.layout') flexLayout = 'column';
  @HostBinding('attr.layout-align') flexLayoutAlign = 'start';



  @Input() value: boolean = false
  @Output() valueChange: EventEmitter<boolean> = new EventEmitter(false)

  @Input() labelPosition: 'before' | 'after' | 'below' = 'before'
  @Input() disabled: boolean
  @Input() hideLabel: boolean
  @Input() onlyLabel: boolean


  /**
   * Configuration Fields
   */
  @Input() label: string = ''
  @Input() defaultValue: boolean = false
  /* end Configuration Fields */

  @Output() change: EventEmitter<any> = new EventEmitter(false)
  onTouched: () => any = () => { };
  private controlValueAccessorChangeFn: (value: any) => void = (value) => { };

  constructor(private changeDetectorRef: ChangeDetectorRef) {
  }


  ngOnInit() {
    Hacks.materialDesignPlaceholderText(this.changeDetectorRef)
  }

  ngOnChanges(changes) {
  }

  handleValueChange(value: boolean) {
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
    this.change.emit(new SlideToggleWidgetChange(this, this.value))
  }

  public writeValue(value: boolean): void {
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
