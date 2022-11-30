import {ObjectUtil} from '@tangential/core'
//noinspection ES6PreferShortImport
import {NumberType, NumberTypeIF} from '../../data-type/number/number-type'
import {InputConfig, InputConfigJson} from '../../input-config'


export interface NumberInputConfigIF extends InputConfigJson {
  labelPosition?: 'before' | 'after'
  disabled?: boolean
  typeConfig?: NumberTypeIF
}

const Model: NumberInputConfigIF = {
  label:         'Number',
  labelPosition: 'before',
  disabled:      false,
  typeConfig:    <NumberTypeIF>{
    _inputTypeKey: NumberType.TYPE_NAME,
    defaultValue:  0
  }
}

const demoConfig: NumberInputConfigIF = Object.assign({}, Model)

export class NumberInputConfig extends InputConfig implements NumberInputConfigIF {
  static override $model: NumberInputConfigIF = ObjectUtil.assignDeep({}, InputConfig.$model, Model)

  static override INPUT_NAME = 'NumberInput'
  labelPosition: 'before' | 'after'
  override disabled: boolean
  override typeConfig: NumberType

  constructor(config?: NumberInputConfigIF, key?: string) {
    super(NumberInputConfig.INPUT_NAME, config || {}, key)
    this.typeConfig = new NumberType(this.typeConfig)
  }

  getDemoInstance(): InputConfigJson {
    return new NumberInputConfig(demoConfig)
  }

}

InputConfig.register(NumberInputConfig)
