import {Jsonified, ObjectUtil} from '@tangential/core'
//noinspection TypeScriptPreferShortImport
import {BooleanType, BooleanTypeIF} from '../../data-type/boolean/boolean-type'
import {InputConfig, InputConfigJson} from '../../input-config'


export interface SlideToggleConfigIF extends InputConfigJson {
  labelPosition?: 'before' | 'after'
  disabled?: boolean
  typeConfig?: BooleanTypeIF
}

const Model: SlideToggleConfigIF = {
  label:         'Slide Toggle',
  labelPosition: 'before',
  disabled:      false,
  typeConfig:    <BooleanTypeIF>{
    _inputTypeKey: BooleanType.TYPE_NAME,
    defaultValue:  false
  }
}


const demoConfig: SlideToggleConfigIF = {
  label:         'Slide Toggle',
  labelPosition: 'before',
  disabled:      false,
  typeConfig:    <BooleanTypeIF>{
    _inputTypeKey: BooleanType.TYPE_NAME,
    defaultValue:  false
  }
}

export class SlideToggleConfig extends InputConfig implements Jsonified<SlideToggleConfig, SlideToggleConfigIF>, SlideToggleConfigIF {
  static $model: SlideToggleConfigIF = ObjectUtil.assignDeep({}, InputConfig.$model, Model)

  static INPUT_NAME = 'SlideToggle'
  labelPosition: 'before' | 'after'
  disabled: boolean
  typeConfig: BooleanType

  constructor(config?: SlideToggleConfigIF, key?: string) {
    super(SlideToggleConfig.INPUT_NAME, config || {}, key)
    this.typeConfig = new BooleanType(this.typeConfig)
  }

  getDemoInstance(): InputConfigJson {
    return new SlideToggleConfig(demoConfig)
  }
}
InputConfig.register(SlideToggleConfig)
