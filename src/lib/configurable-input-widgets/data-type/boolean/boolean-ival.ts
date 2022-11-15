import {Jsonified, ObjectUtil} from '@tangential/core'
import {ConfigurableInputIval, ConfigurableInputIvalJson} from '../configurable-input-ival'

export interface BooleanIvalIF extends ConfigurableInputIvalJson {
  value?: boolean
}

const Model: BooleanIvalIF = {
  value: false
}

export class BooleanIval extends ConfigurableInputIval implements Jsonified<BooleanIval, BooleanIvalIF>, BooleanIvalIF {
  static override $model: BooleanIvalIF = ObjectUtil.assignDeep({}, ConfigurableInputIval.$model, Model)
  override value: boolean


  constructor(cfg?: BooleanIvalIF, key?: string) {
    super(cfg, key)
    this.value = ( cfg.value === true )
  }

}
