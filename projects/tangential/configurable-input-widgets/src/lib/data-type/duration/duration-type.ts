import {Jsonified, ObjectUtil} from '@tangential/core'

import {isNumeric, NumberType, NumberTypeIF, NumberIval, NumberIvalIF} from '../number'
import {ConfigurableInputType} from '../configurable-input-type'

export interface DurationTypeJson extends NumberTypeIF {
  min?: number
  max?: number
  step?: number
  decimalPlaces?: number
  defaultValue?: number
}

const Model: DurationTypeJson = {
  max:           null,
  step:          1000,
  decimalPlaces: 0,
  defaultValue:  0
}

export class DurationType extends NumberType implements Jsonified<DurationType, DurationTypeJson>, NumberTypeIF {
  static override $model: NumberTypeIF = ObjectUtil.assignDeep({}, ConfigurableInputType.$model, Model)

  static override TYPE_NAME = 'Duration'
  override max?: number
  override step?: number
  override decimalPlaces?: number
  override defaultValue?: number

  constructor(config?: DurationTypeJson, key?: string) {
    super(config || {}, key)
  }

  override getInputTypeKey(): string {
    return DurationType.TYPE_NAME
  }


  override createValue(cfg?: NumberIvalIF, key?: string): NumberIval {
    cfg = cfg || <any>{}
    return new NumberIval({
      value: isNumeric(cfg.value) ? cfg.value : this.defaultValue
    }, key || this.$key);
  }
}

ConfigurableInputType.register(DurationType)
