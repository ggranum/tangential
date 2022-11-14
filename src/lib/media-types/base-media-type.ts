import {generatePushID, Jsonified, JsonUtil} from '@tangential/core'

export interface BaseMediaTypeJson {
  $key?: string
}

const Model: BaseMediaTypeJson = {
  $key: undefined
}

export class BaseMediaType implements Jsonified<BaseMediaType, BaseMediaTypeJson>, BaseMediaTypeJson {
  static $model: BaseMediaTypeJson = Model
  $key?: string

  constructor(config: any, key?: string) {
    JsonUtil.applyJsonToInstance(this, config)
    this.$key = key || config.$key || generatePushID()
  }

  getModel():BaseMediaTypeJson {
    // this.constructor dereferences to the subclass, so we're looking at a static field on the subclass.
    // This can easily break if a subclass doesn't follow the static $model pattern... but that's the entire point
    // of the *Type pattern subclassing from this BaseMediaType class, soooo.
    const hack: { '$model': BaseMediaTypeJson } = (this.constructor as unknown) as ({ '$model': BaseMediaTypeJson })
    return hack['$model']
  }

  toJson(withHiddenFields?: boolean): BaseMediaTypeJson {
    return JsonUtil.instanceToJson(this, withHiddenFields)
  }


}
