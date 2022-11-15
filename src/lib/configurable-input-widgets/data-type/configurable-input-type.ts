import {Type} from '@angular/core'
import {Jsonified, ObjectUtil} from '@tangential/core'
import {StampedMediaType, StampedMediaTypeJson} from '@tangential/media-types'
import {ConfigurableInputIval} from './configurable-input-ival'

export interface ConfigurableInputTypeJson extends StampedMediaTypeJson {
  _inputTypeKey?: string
  defaultValue?: any
}


const inputTypeRegistry = {}

const Model: ConfigurableInputTypeJson = {
  _inputTypeKey: null,
  defaultValue:  null
}

export abstract class ConfigurableInputType extends StampedMediaType implements Jsonified<ConfigurableInputType, ConfigurableInputTypeJson>, ConfigurableInputTypeJson {
  static override $model: ConfigurableInputTypeJson = ObjectUtil.assignDeep({}, StampedMediaType.$model, Model)

  static TYPE_NAME: string
  defaultValue?: any
  _inputTypeKey?: string

  constructor(config: any, key?: string) {
    super(config, key)
    this._inputTypeKey = this.getInputTypeKey()
  }

  abstract getInputTypeKey(): string

  abstract isNumeric(): boolean

  abstract createValue(valueConfig?: any, key?: string): ConfigurableInputIval

  static register<T extends ConfigurableInputType>(inputTypeCtor: Type<T>) {
    inputTypeRegistry[inputTypeCtor['TYPE_NAME']] = inputTypeCtor
  }

  static create(typeConfig: ConfigurableInputTypeJson, key?: string, inputTypeKey?: string) {
    typeConfig = typeConfig || {}
    key = key || typeConfig.$key
    inputTypeKey = inputTypeKey || typeConfig._inputTypeKey
    return new inputTypeRegistry[inputTypeKey](typeConfig, key)
  }
}
