import {Jsonified, ObjectUtil} from '@tangential/core'
import {ConfigurableInputIval, ConfigurableInputIvalJson} from '../configurable-input-ival'


export interface NumberIvalIF extends ConfigurableInputIvalJson {
  value?: number
}

const Model: NumberIvalIF = {
  value: 0
}

export class NumberIval extends ConfigurableInputIval implements Jsonified<NumberIval, NumberIvalIF>, NumberIvalIF {
  static $model: NumberIvalIF = ObjectUtil.assignDeep({}, ConfigurableInputIval.$model, Model)
  value: number


  constructor(config?: NumberIvalIF, key?: string) {
    super(config = config || {}, key)
    this.value = config.value || 0
  }

}
