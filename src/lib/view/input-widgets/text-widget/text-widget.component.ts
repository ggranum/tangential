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
export const TANJ_TEXT_WIDGET_VIEW_CONTROL_VALUE_ACCESSOR: any = {
  provide:     NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => TextWidgetComponent),
  multi:       true
};

export class TextWidgetChange {

  constructor(public source: TextWidgetComponent, public value: string) {
  }
}


@Component({
  selector:      'tanj-text-widget',
  template:      `<!-- -->
  <div flex class="tanj-input-template tanj-mode-edit"
       [ngClass]="{'tanj-disabled': disabled}"
       layout="row"
       layout-align="start center">
    <span *ngIf="!hideLabel && labelPosition == 'before'" class="tanj-label tanj-before">{{label}}</span>
    <div flex class="tanj-widget-input" layout="column" layout-align="center start">
      <div flex *ngIf="!onlyLabel" class="tanj-widget-input" layout="row" layout-align="start">
        <md-input-container flex
                            class="tanj-text-input-field tanj-widget-input"
                            dividerColor="accent"
                            layout="row"
                            layout-align="start">
          <input flex
                 mdInput
                 class="tanj-input"
                 type="text"
                 minlength="{{minLength}}"
                 maxlength="{{maxLength}}"
                 [disabled]="disabled"
                 (change)="valueChange.emit(value)"
                 [(ngModel)]="value"/>
        </md-input-container>
      </div>
      <span *ngIf="!hideLabel && labelPosition == 'below'" class="tanj-label tanj-below">{{label}}</span>
    </div>
    <span *ngIf="!hideLabel && labelPosition == 'after'" class="tanj-label tanj-after">{{label}}</span>
  </div>
                 `,
  providers:     [TANJ_TEXT_WIDGET_VIEW_CONTROL_VALUE_ACCESSOR],
  encapsulation: ViewEncapsulation.None
})
export class TextWidgetComponent implements ControlValueAccessor, OnChanges, OnInit {

  // turn this into a class
  @HostBinding('attr.flex') flex = '';
  @HostBinding('attr.layout') flexLayout = 'column';
  @HostBinding('attr.layout-align') flexLayoutAlign = 'start';


  @Input() value: string = ''
  @Output() valueChange: EventEmitter<string> = new EventEmitter(false)

  @Input() labelPosition: 'before' | 'after' | 'below' = 'before'
  @Input() disabled: boolean
  @Input() hideLabel: boolean
  @Input() onlyLabel: boolean

  /**
   * Configuration Fields
   */
  @Input() label: string = ''
  @Input() defaultValue: string = ''
  @Input() maxLength: number = 100
  @Input() minLength: number = 0
  /* end Configuration Fields */
  @Output() change: EventEmitter<any> = new EventEmitter(false)

  onTouched: () => any = () => { };
  private controlValueAccessorChangeFn: (value: any) => void = (value) => {
  };


  constructor(private changeDetectorRef: ChangeDetectorRef) {
  }


  ngOnInit() {
    Hacks.materialDesignPlaceholderText(this.changeDetectorRef)
  }

  ngOnChanges(changes) {
  }

  handleValueChange(value: string) {
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
    this.change.emit(new TextWidgetChange(this, this.value))
  }

  public writeValue(value: string): void {
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
