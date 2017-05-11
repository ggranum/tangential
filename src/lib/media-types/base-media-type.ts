import {generatePushID, Jsonified, JsonUtil} from '@tangential/core'

export interface BaseMediaTypeJson {
  $key?: string
}

const Model: BaseMediaTypeJson = {
  $key: null
}

export class BaseMediaType implements Jsonified<BaseMediaType, BaseMediaTypeJson>, BaseMediaTypeJson {
  static $model: BaseMediaTypeJson = Model
  $key?: string

  constructor(config: any, key?: string) {
    JsonUtil.applyJsonToInstance(this, config)
    this.$key = key || config.$key || generatePushID()
  }

  getModel() {
    return this.constructor['$model']
  }

  toJson(withHiddenFields?: boolean): BaseMediaTypeJson {
    return JsonUtil.instanceToJson(this, withHiddenFields)
  }


}
