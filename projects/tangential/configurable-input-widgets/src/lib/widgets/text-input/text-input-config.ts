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
    defaultValue:  undefined
  }
}

const demoConfig: TextInputConfigIF = ObjectUtil.assignDeep({}, Model, {
  typeConfig: {
    maxLength:    100,
    defaultValue: undefined
  }
})

export class TextInputConfig extends InputConfig implements Jsonified<TextInputConfig, TextInputConfigIF>, TextInputConfigIF {
  static override $model: TextInputConfigIF = ObjectUtil.assignDeep({}, InputConfig.$model, Model)

  static override INPUT_NAME = 'TextInput'
  labelPosition: 'before' | 'after' | 'below' = 'before'

  /** @todo: ggranum: Verify we need these fields (they already exist on superclass) */
  override disabled: boolean = false
  override typeConfig: TextType

  constructor(config?: TextInputConfigIF, key?: string) {
    super(TextInputConfig.INPUT_NAME, config || {}, key)
    /** @todo: ggranum: Verify this change (this.typeConfig to super.typeConfig) works. */
    this.typeConfig = new TextType(super.typeConfig || {})
  }

  getDemoInstance(): InputConfigJson {
    return new TextInputConfig(demoConfig)
  }

}

InputConfig.register(TextInputConfig)
