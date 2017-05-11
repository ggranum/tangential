import {Jsonified, ObjectUtil} from '@tangential/core'
//noinspection TypeScriptPreferShortImport
import {BooleanType, BooleanTypeIF} from '../../data-type/boolean/boolean-type'
import {InputConfig, InputConfigJson} from '../../input-config'


export interface CheckboxConfigIF extends InputConfigJson {
  labelPosition?: 'before' | 'after'
  typeConfig?: BooleanTypeIF
}

const Model: CheckboxConfigIF = {
  label:         'Checkbox',
  labelPosition: 'before',
  disabled:      false,
  typeConfig:    {
    _inputTypeKey: BooleanType.TYPE_NAME,
    defaultValue:  false
  }
}


const demoConfig: CheckboxConfigIF = ObjectUtil.assignDeep({}, Model, {
  label:         'Checkbox',
  labelPosition: 'before',
  typeConfig:    <BooleanTypeIF>{}
})

export class CheckboxWidgetConfig extends InputConfig implements Jsonified<CheckboxWidgetConfig, CheckboxConfigIF>, CheckboxConfigIF {
  static $model: CheckboxConfigIF = ObjectUtil.assignDeep({}, InputConfig.$model, Model)
  static INPUT_NAME = 'Checkbox'
  labelPosition: 'before' | 'after'
  disabled: boolean
  typeConfig: BooleanType

  constructor(config?: CheckboxConfigIF, key?: string) {
    super(CheckboxWidgetConfig.INPUT_NAME, config, key)
    this.typeConfig = new BooleanType(this.typeConfig)
  }

  getDemoInstance(): InputConfigJson {
    return new CheckboxWidgetConfig(demoConfig)
  }


}
InputConfig.register(CheckboxWidgetConfig)
