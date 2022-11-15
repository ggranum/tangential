import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChange,
  ViewEncapsulation
} from '@angular/core'
import {MatDialog} from '@angular/material/dialog'
import {Hacks} from '@tangential/core'
import {InputConfig, InputConfigJson} from '../../input-config'
//noinspection ES6PreferShortImport
import {ChooseInputWidgetDialog} from '../choose-input-widget-dialog/choose-input-widget-dialog'
import {InputRegistry} from '../input-types-registry'
import {InputViewModes} from '../input-view-mode'
//noinspection ES6PreferShortImport
import {InputTemplateIF} from '../template-components/input-template-component/input-template.component'

@Component({
  selector:        'tanj-edit-configurable-widget',
  templateUrl:     './edit-configurable-widget.component.html',
  encapsulation:   ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.Default
})
export class EditConfigurableWidgetComponent implements OnInit, OnChanges {

  @Input() inputConfig: InputConfig
  @Output() inputConfigChange: EventEmitter<InputConfig> = new EventEmitter(false)

  inputNames: string[] = []
  inputTemplate: InputTemplateIF

  constructor(private inputRegistry: InputRegistry,
              private changeDetectorRef: ChangeDetectorRef,
              public dialog: MatDialog) {
  }

  ngOnInit() {
    this.inputNames = this.inputRegistry.inputNames
    if (this.inputConfig) {
      this.updateInputConfig(this.inputConfig)
    }

  }

  ngOnChanges(changes: { inputConfig: SimpleChange }): void {
    if (changes.inputConfig) {
      this.updateInputConfig(this.inputConfig)
    }
  }

  inputWidgetChange(newConfig: InputConfig) {
    const inputName: string = newConfig._inputName
    if (!this.inputConfig || inputName !== this.inputConfig._inputName) {
      const inputEntrySet = this.inputRegistry.getInputSet(inputName)

      const base: InputConfigJson = newConfig.toJson(true)
      if (this.inputConfig) {
        /** @todo: ggranum: Figure out why this is using label on a BaseMediaType model, that doesn't have a label field.  */
        base.label = this.inputConfig.label !== (this.inputConfig.getModel() as any).label
          ? this.inputConfig.label
          : null
        base.orderIndex = this.inputConfig.orderIndex
      }
      const newInputConfig: InputConfig = inputEntrySet.createInputConfig(base)
      newInputConfig._inputName = inputName
      this.updateInputConfig(newInputConfig)
      this.inputConfigChange.emit(this.inputConfig)
    }
  }

  updateInputConfig(inputConfig: InputConfig) {
    this.inputConfig = inputConfig
    const inputValue = inputConfig.typeConfig.createValue()
    this.inputTemplate = this.inputRegistry.createTemplateForType(inputConfig, InputViewModes.CONFIGURE, inputValue)
    Hacks.materialDesignPlaceholderText(this.changeDetectorRef)
  }

  canChangeWidget(): boolean {
    return !this.inputConfig.$isSystem
  }

  showChooseInputDialog() {
    const dialogRef = this.dialog.open(ChooseInputWidgetDialog, {
      height: '80%',
      width:  '100%',
    });
    dialogRef.afterClosed().subscribe((result: InputTemplateIF) => {
      if (result && result.config) {
        this.inputWidgetChange(result.config)
      }
    });
  }

  onTemplateChanged(template: InputTemplateIF) {
    if (template.ival && template.ival.value !== template.config.typeConfig.defaultValue) {
      template.ival = template.config.typeConfig.createValue()
    }
  }

}

