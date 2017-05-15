import {Jsonified, ObjectUtil} from '@tangential/core'

import {isNumeric} from 'rxjs/util/isNumeric'
import {ConfigurableInputType, ConfigurableInputTypeJson} from '../configurable-input-type'
import {NumberIval, NumberIvalIF} from './number-ival'

export interface NumberTypeIF extends ConfigurableInputTypeJson {
  min?: number
  max?: number
  step?: number
  decimalPlaces?: number
  defaultValue?: number
}

const Model: NumberTypeIF = {
  min:           0,
  max:           100,
  step:          1,
  decimalPlaces: 1,
  defaultValue:  50
}

export class NumberType extends ConfigurableInputType implements Jsonified<NumberType, NumberTypeIF>, NumberTypeIF {
  static $model: NumberTypeIF = ObjectUtil.assignDeep({}, ConfigurableInputType.$model, Model)


  static TYPE_NAME = 'Number'
  min?: number
  max?: number
  step?: number
  decimalPlaces?: number
  defaultValue?: number


  constructor(config?: NumberTypeIF, key?: string) {
    super(config || {}, key)
  }

  getInputTypeKey(): string {
    return NumberType.TYPE_NAME
  }

  isNumeric(): boolean {
    return true
  }

  createValue(cfg?: NumberIvalIF, key?: string): NumberIval {
    cfg = cfg || <any>{}
    return new NumberIval({
      value: isNumeric(cfg.value) ? cfg.value : this.defaultValue
    }, key || this.$key);
  }
}

ConfigurableInputType.register(NumberType)
