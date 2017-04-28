import {Jsonified, ObjectUtil} from '@tangential/core'
import {ConfigurableInputType, ConfigurableInputTypeJson} from '../configurable-input-type'

import {BooleanIval, BooleanIvalIF} from './boolean-ival'

export interface BooleanTypeIF extends ConfigurableInputTypeJson {
  defaultValue?: boolean
}

const Model: BooleanTypeIF = {
  defaultValue: false
}

export class BooleanType extends ConfigurableInputType implements Jsonified<BooleanType, BooleanTypeIF>, BooleanTypeIF {
  static $model: BooleanTypeIF = ObjectUtil.assignDeep({}, ConfigurableInputType.$model, Model)

  static TYPE_NAME = 'Boolean'
  defaultValue?: boolean


  constructor(config?: BooleanTypeIF, key?: string) {
    super(config || {}, key)
  }

  getInputTypeKey(): string {
    return BooleanType.TYPE_NAME
  }

  isNumeric(): boolean {
    return false
  }

  createValue(cfg?: BooleanIvalIF, key?: string): BooleanIval {
    cfg = cfg || <any>{}
    return new BooleanIval({
      value: (cfg.value === true || cfg.value === false) ? cfg.value : this.defaultValue
    }, key || this.$key);
  }

}

ConfigurableInputType.register(BooleanType)
