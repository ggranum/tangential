import {Jsonified, ObjectUtil} from '@tangential/core'
import {ConfigurableInputIval, ConfigurableInputIvalJson} from '../configurable-input-ival'


export interface TextIvalIF extends ConfigurableInputIvalJson {
  value?: string
}

const Model: TextIvalIF = {
  value: ''
}

export class TextIval extends ConfigurableInputIval implements Jsonified<TextIval, TextIvalIF>, TextIvalIF {
  static override $model: TextIvalIF = ObjectUtil.assignDeep({}, ConfigurableInputIval.$model, Model)

  override value: string

  constructor(config?: TextIvalIF, key?: string) {
    super(config, key)
    this.value = config.value || ''
  }
}
