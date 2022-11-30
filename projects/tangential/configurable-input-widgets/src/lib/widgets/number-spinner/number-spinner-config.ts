import {ObjectUtil} from '@tangential/core'
//noinspection ES6PreferShortImport
import {NumberType, NumberTypeIF} from '../../data-type/number/number-type'
import {InputConfig, InputConfigJson} from '../../input-config'


export interface NumberSpinnerConfigIF extends InputConfigJson {
  labelPosition?: 'before' | 'after' | 'below'
  disabled?: boolean
  typeConfig?: NumberTypeIF
}

const Model: NumberSpinnerConfigIF = {
  label:         'Number Spinner',
  labelPosition: 'before',
  disabled:      false,
  typeConfig:    <NumberTypeIF>{
    _inputTypeKey: NumberType.TYPE_NAME,
    defaultValue:  0
  }
}

const demoConfig: NumberSpinnerConfigIF = Object.assign({}, Model, {
  label: 'Number Spinner'
})

export class NumberSpinnerConfig extends InputConfig implements NumberSpinnerConfigIF {
  static override $model: NumberSpinnerConfigIF = ObjectUtil.assignDeep({}, InputConfig.$model, Model)

  static override INPUT_NAME = 'NumberSpinner'
  labelPosition: 'before' | 'after' | 'below'
  override disabled: boolean
  override typeConfig: NumberType

  constructor(config?: NumberSpinnerConfigIF, key?: string) {
    super(NumberSpinnerConfig.INPUT_NAME, config || {}, key)
    this.typeConfig = new NumberType(super.typeConfig)
  }

  getDemoInstance(): InputConfigJson {
    return new NumberSpinnerConfig(demoConfig)
  }

}

InputConfig.register(NumberSpinnerConfig)
