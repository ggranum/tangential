import {
  Injectable,
  Type
} from '@angular/core'
import {
  ObjectUtil,
  ObjMap
} from '@tangential/core'
import {ConfigurableInputIval} from '../data-type/configurable-input-ival'
import {ConfigurableInputTypeJson} from '../data-type/configurable-input-type'
import {InputConfig} from '../input-config'
//noinspection TypeScriptPreferShortImport
import {CheckboxWidgetConfig} from '../widgets/checkbox/checkbox-widget-config'
//noinspection TypeScriptPreferShortImport
import {CheckboxWidgetTemplateComponent} from '../widgets/checkbox/checkbox-widget.template.component'
//noinspection TypeScriptPreferShortImport
import {DateTimeInputConfig} from '../widgets/date-time-input/date-time-input-config'
//noinspection TypeScriptPreferShortImport
import {DateTimeTemplateComponent} from '../widgets/date-time-input/date-time-template.component'
//noinspection TypeScriptPreferShortImport
import {DurationPickerConfig} from '../widgets/duration-picker/duration-picker-config'
//noinspection TypeScriptPreferShortImport
import {DurationPickerTemplateComponent} from '../widgets/duration-picker/duration-picker-template.component'
//noinspection TypeScriptPreferShortImport
import {IconRatingWidgetConfig} from '../widgets/icon-rating-widget/icon-rating-widget-config'
//noinspection TypeScriptPreferShortImport
import {IconRatingWidgetTemplateComponent} from '../widgets/icon-rating-widget/icon-rating-widget.template.component'
//noinspection TypeScriptPreferShortImport
import {NumberInputConfig} from '../widgets/number-input/number-input-config'
//noinspection TypeScriptPreferShortImport
import {NumberTemplateComponent} from '../widgets/number-input/number-template.component'
//noinspection TypeScriptPreferShortImport
import {NumberSliderConfig} from '../widgets/number-slider/number-slider-config'
//noinspection TypeScriptPreferShortImport
import {NumberSliderTemplateComponent} from '../widgets/number-slider/number-slider-template.component'
//noinspection TypeScriptPreferShortImport
import {NumberSpinnerConfig} from '../widgets/number-spinner/number-spinner-config'
//noinspection TypeScriptPreferShortImport
import {NumberSpinnerTemplateComponent} from '../widgets/number-spinner/number-spinner-template.component'
//noinspection TypeScriptPreferShortImport
import {SlideToggleConfig} from '../widgets/slide-toggle/slide-toggle-widget-config'
//noinspection TypeScriptPreferShortImport
import {SlideToggleWidgetTemplateComponent} from '../widgets/slide-toggle/slide-toggle-widget.template.component'
//noinspection TypeScriptPreferShortImport
import {TextInputConfig} from '../widgets/text-input/text-input-config'
//noinspection TypeScriptPreferShortImport
import {TextTemplateComponent} from '../widgets/text-input/text-template.component'
import {
  InputViewMode,
  InputViewModes
} from './input-view-mode'
//noinspection TypeScriptPreferShortImport
import {InputTemplateIF} from './template-components/input-template-component/input-template.component'


export class InputSet {
  inputCtor: Type<InputConfig>

  view: Type<InputTemplateIF>

  constructor(config: Type<InputConfig>, view: Type<InputTemplateIF>) {
    this.inputCtor = config
    this.view = view
  }

  createInputConfig(data?: ConfigurableInputTypeJson, key?: string): InputConfig {
    return new this.inputCtor(data || {}, key)
  }

}


@Injectable()
export class InputRegistry {

  private inputEntries: ObjMap<InputSet> = {}

  constructor() {
    this.registerTypes()
  }

  private registerTypes() {
    this.inputEntries[CheckboxWidgetConfig.INPUT_NAME] = new InputSet(CheckboxWidgetConfig, CheckboxWidgetTemplateComponent)
    this.inputEntries[SlideToggleConfig.INPUT_NAME] = new InputSet(SlideToggleConfig, SlideToggleWidgetTemplateComponent)
    this.inputEntries[NumberInputConfig.INPUT_NAME] = new InputSet(NumberInputConfig, NumberTemplateComponent)
    this.inputEntries[NumberSpinnerConfig.INPUT_NAME] = new InputSet(NumberSpinnerConfig, NumberSpinnerTemplateComponent)
    this.inputEntries[NumberSliderConfig.INPUT_NAME] = new InputSet(NumberSliderConfig, NumberSliderTemplateComponent)
    this.inputEntries[TextInputConfig.INPUT_NAME] = new InputSet(TextInputConfig, TextTemplateComponent)
    this.inputEntries[DateTimeInputConfig.INPUT_NAME] = new InputSet(DateTimeInputConfig, DateTimeTemplateComponent)
    this.inputEntries[DurationPickerConfig.INPUT_NAME] = new InputSet(DurationPickerConfig, DurationPickerTemplateComponent)
    this.inputEntries[IconRatingWidgetConfig.INPUT_NAME] = new InputSet(IconRatingWidgetConfig, IconRatingWidgetTemplateComponent)
  }

  allTemplates(mode: InputViewMode): InputTemplateIF[] {
    return ObjectUtil.keys(this.inputEntries).map((inputName) => {
      return this.createTemplateForTypeKey(inputName, mode)
    })
  }

  getInputSet(inputName: string): InputSet {
    return this.inputEntries[inputName]
  }

  getComponentCtorFor(inputConfig: InputConfig, mode: InputViewMode): Type<any> {
    let result: Type<any>
    const entry = this.inputEntries[inputConfig._inputName]
    result = entry.view
    if (!result) {
      throw new Error(`Invalid mode '${mode}'.`)
    }
    return result
  }

  createTemplateForTypeKey(inputName: string, mode: InputViewMode): InputTemplateIF {
    const inputEntrySet = this.getInputSet(inputName)
    const inputConfig = inputEntrySet.createInputConfig()
    return {
      config: inputConfig,
      ival:   inputConfig.typeConfig.createValue(),
      mode:   mode
    }
  }

  createTemplateForType(inputConfig: InputConfig, mode?: InputViewMode, ival?: ConfigurableInputIval): InputTemplateIF {
    ival = ival || inputConfig.typeConfig.createValue({})
    mode = mode || InputViewModes.EDIT
    ival.$key = inputConfig.$key
    return {
      config: inputConfig,
      ival:   ival,
      mode:   mode
    }
  }


  get inputNames(): string[] {
    return Object.keys(this.inputEntries)
  }


}
