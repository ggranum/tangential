import {Jsonified, ObjectUtil} from '@tangential/core'
import {TextType, TextTypeIF} from '../../data-type/text/text-type'
import {InputConfig, InputConfigJson} from '../../input-config'


export interface TextInputConfigIF extends InputConfigJson {
  labelPosition?: 'before' | 'after' | 'below'
  disabled?: boolean
  typeConfig?: TextTypeIF
}

const Model: TextInputConfigIF = {
  label:         'Short Text',
  labelPosition: 'before',
  disabled:      false,
  typeConfig:    {
    _inputTypeKey: TextType.TYPE_NAME,
    maxLength:     100,
    defaultValue:  null
  }
}

const demoConfig: TextInputConfigIF = ObjectUtil.assignDeep({}, Model, {
  typeConfig: {
    maxLength:    100,
    defaultValue: null
  }
})

export class TextInputConfig extends InputConfig implements Jsonified<TextInputConfig, TextInputConfigIF>, TextInputConfigIF {
  static $model: TextInputConfigIF = ObjectUtil.assignDeep({}, InputConfig.$model, Model)

  static INPUT_NAME = 'TextInput'
  labelPosition: 'before' | 'after' | 'below' = 'before'

  disabled: boolean
  typeConfig: TextType

  constructor(config?: TextInputConfigIF, key?: string) {
    super(TextInputConfig.INPUT_NAME, config || {}, key)
    this.typeConfig = new TextType(this.typeConfig)
  }

  getDemoInstance(): InputConfigJson {
    return new TextInputConfig(demoConfig)
  }

}

InputConfig.register(TextInputConfig)
