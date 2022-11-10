import {Jsonified, ObjectUtil} from '@tangential/core'
import {isNumeric} from 'rxjs/internal-compatibility'

import {NumberIval, NumberIvalIF} from '../number/number-ival'
import {NumberType, NumberTypeIF} from '../number/number-type'
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
  static $model: NumberTypeIF = ObjectUtil.assignDeep({}, ConfigurableInputType.$model, Model)

  static TYPE_NAME = 'Duration'
  max?: number
  step?: number
  decimalPlaces?: number
  defaultValue?: number

  constructor(config?: DurationTypeJson, key?: string) {
    super(config || {}, key)
  }

  getInputTypeKey(): string {
    return DurationType.TYPE_NAME
  }


  createValue(cfg?: NumberIvalIF, key?: string): NumberIval {
    cfg = cfg || <any>{}
    return new NumberIval({
      value: isNumeric(cfg.value) ? cfg.value : this.defaultValue
    }, key || this.$key);
  }
}

ConfigurableInputType.register(DurationType)
