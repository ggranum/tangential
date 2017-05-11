import {
  AfterViewInit,
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  EventEmitter,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChange,
  ViewChild,
  ViewEncapsulation
} from '@angular/core'
//noinspection TypeScriptPreferShortImport
import {ConfigurableInputIval} from '../../../data-type/configurable-input-ival'
import {InputConfig} from '../../../input-config'
import {InputRegistry} from '../../input-types-registry'
import {InputViewMode} from '../../input-view-mode'
import {InputTemplateIF} from './input-template.component'
import {InputTemplateDirective} from './input-template.directive'
@Component({
  selector: 'tanj-input-template-container',
  template: `
              <ng-template tanj-input-template-host></ng-template>`,
  encapsulation: ViewEncapsulation.None
})
export class InputTemplateContainerComponent implements AfterViewInit, OnChanges, OnDestroy {

  @Input() template: InputTemplateIF
  @Input() inputConfig: InputConfig;
  @Input() inputIval: ConfigurableInputIval;
  @Input() mode = <InputViewMode>null;
  @Input() hideLabel?: boolean = false;
  @Input() onlyLabel?: boolean = false;
  @Output() change: EventEmitter<any> = new EventEmitter(false)

  @ViewChild(InputTemplateDirective) inputItemHost: InputTemplateDirective;

  private _componentRef: ComponentRef<InputTemplateIF>

  constructor(private _typeRegistry: InputRegistry, private _componentFactoryResolver: ComponentFactoryResolver, private _zone: NgZone) {
  }

  ngAfterViewInit() {
  }

  ngOnDestroy() {
  }

  ngOnChanges(changes: { template: SimpleChange }) {
    if (changes.template && this.template) {
      this.inputConfig = this.template.config
      this.inputIval = this.template.ival
      this.mode = this.template.mode
      this.hideLabel = this.template.hideLabel
      this.onlyLabel = this.template.onlyLabel
    }
    if (this.inputConfig) {
      this.loadComponent()
    } else {
      console.warn('InputTemplateContainerComponent', 'No input type!', this.inputIval, this.mode)
    }
  }

  loadComponent() {
    this._zone.run(() => {
      const componentCtor = this._typeRegistry.getComponentCtorFor(this.inputConfig, this.mode)
      const componentFactory = this._componentFactoryResolver.resolveComponentFactory(componentCtor);
      const viewContainerRef = this.inputItemHost.viewContainerRef;
      viewContainerRef.clear();

      this._componentRef = viewContainerRef.createComponent(componentFactory);
      this._componentRef.instance.config = this.inputConfig
      this._componentRef.instance.ival = this.inputIval
      this._componentRef.instance.mode = this.mode
      this._componentRef.instance.hideLabel = this.hideLabel
      this._componentRef.instance.onlyLabel = this.onlyLabel
      this._componentRef.instance.change = this.change
      this._componentRef.changeDetectorRef.detectChanges()
    })
  }

}
