import {Type} from '@angular/core'
import {
  Jsonified,
  ObjectUtil
} from '@tangential/core'
import {
  StampedMediaType,
  StampedMediaTypeJson
} from '@tangential/media-types'
import {
  ConfigurableInputType,
  ConfigurableInputTypeJson
} from './data-type/configurable-input-type'


export interface InputConfigJson extends StampedMediaTypeJson {
  $isSystem?: boolean
  _inputName?: string
  orderIndex?: number
  disabled?: boolean
  label?: string
  typeConfig?: ConfigurableInputTypeJson
}

const Model: InputConfigJson = {
  $isSystem:  false,
  _inputName: null,
  orderIndex: null,
  disabled:   false,
  label:      'Label for this value',
  typeConfig: null
}

const inputConfigRegistry = {}

export abstract class InputConfig extends StampedMediaType implements Jsonified<InputConfig, InputConfigJson>, InputConfigJson {
  static $model: InputConfigJson = ObjectUtil.assignDeep({}, StampedMediaType.$model, Model)

  static INPUT_NAME: string
  $isSystem: boolean
  _inputName: string
  orderIndex?: number
  disabled?: boolean
  label: string
  typeConfig?: ConfigurableInputType

  constructor(_inputName: string, config: InputConfigJson, key?: string) {
    super(config, key)
    this._inputName = _inputName
    this.typeConfig = ConfigurableInputType.create(this.typeConfig)
    if (this.$key === 'when') {
      this.$isSystem = true
    }
  }

  abstract getDemoInstance()

  static register<T extends InputConfig>(inputConfigCtor: Type<T>) {
    inputConfigRegistry[inputConfigCtor['INPUT_NAME']] = inputConfigCtor
  }

  static create(config: InputConfigJson, key?: string, inputName?: string) {
    key = key || (config ? config.$key : null)
    inputName = inputName || (config ? config._inputName : null)
    return new inputConfigRegistry[inputName](config, key)
  }
}
