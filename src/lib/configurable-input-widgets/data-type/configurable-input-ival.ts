import {Jsonified, ObjectUtil} from '@tangential/core'
import {BaseMediaType, BaseMediaTypeJson} from '@tangential/media-types'

export interface ConfigurableInputIvalJson extends BaseMediaTypeJson {
  value?: any
}

const Model: ConfigurableInputIvalJson = {
  value: null
}

export class ConfigurableInputIval extends BaseMediaType implements Jsonified<ConfigurableInputIval, ConfigurableInputIvalJson>, ConfigurableInputIvalJson {
  static override $model: ConfigurableInputIvalJson = ObjectUtil.assignDeep({}, BaseMediaType.$model, Model)
  value: any

  constructor(config: any, key?: string) {
    super(config, key);
  }

  get uiValue(): string {
    return '' + this.value
  }

  set uiValue(val: string) {
    this.value = val
  }


}
