import {ObjectUtil} from '@tangential/core'
//noinspection TypeScriptPreferShortImport
import {NumberType, NumberTypeIF} from '../../data-type/number/number-type'
import {InputConfig, InputConfigJson} from '../../input-config'


export interface NumberSliderConfigIF extends InputConfigJson {
  labelPosition?: 'before' | 'after' | 'below'
  disabled?: boolean
  typeConfig?: NumberTypeIF
}

const Model: NumberSliderConfigIF = {
  label:         'Number Slider',
  labelPosition: 'below',
  disabled:      false,
  typeConfig:    <NumberTypeIF>{
    _inputTypeKey: NumberType.TYPE_NAME,
    defaultValue:  0
  }
}

const demoConfig: NumberSliderConfigIF = Object.assign({}, Model)

export class NumberSliderConfig extends InputConfig implements NumberSliderConfigIF {
  static $model: NumberSliderConfigIF = ObjectUtil.assignDeep({}, InputConfig.$model, Model)

  static INPUT_NAME = 'NumberSlider'
  labelPosition: 'before' | 'after' | 'below'
  disabled: boolean
  typeConfig: NumberType

  constructor(config?: NumberSliderConfigIF, key?: string) {
    super(NumberSliderConfig.INPUT_NAME, config || {}, key)
    this.typeConfig = new NumberType(this.typeConfig)
  }

  getDemoInstance(): InputConfigJson {
    return new NumberSliderConfig(demoConfig)
  }

}

InputConfig.register(NumberSliderConfig)
