//noinspection TypeScriptPreferShortImport
//noinspection TypeScriptPreferShortImport
import {MapEntry, ObjectUtil} from '../util/core-util'
import {ObjMap} from './obj-map'


export interface ToJson<T> {
  toJson(withHiddenFields?: boolean): T
}


export interface Jsonified<T, J extends ObjMap<any>> extends ToJson<J> {
  getModel(): J


}

export class JsonUtil {


  static diff<T>(left: T, right: T): T {
    const diff = <T>{}
    let keys = ObjectUtil.keys(<any>left).concat(ObjectUtil.keys(<any>right))
    keys = ObjectUtil.keys(ObjectUtil.toTruthMap(keys))
    keys.forEach(key => {
      const leftVal = left[key]
      const rightVal = right[key]
      if (!JsonUtil.areEqual(leftVal, rightVal)) {
        diff[key] = true
      }
    })
    return diff
  }


  private static areEqual(left, right): boolean {
    let areEqual
    if (left === right) {
      areEqual = true
    } else if (!left || !right) {
      areEqual = false
    } else if (ObjectUtil.isObject(left)) {
      if (!ObjectUtil.isObject(right)) {
        areEqual = false
      } else {
        areEqual = ObjectUtil.keys(JsonUtil.diff(left, right)).length === 0
      }
    }
    return areEqual
  }

  static applyJsonToInstance<T, J extends ObjMap<any>>(instance: Jsonified<T, J>, json: J) {
    const model = instance.getModel()
    json = json || <any>{}
    ObjectUtil.keys(model).forEach((key) => {
      instance[key] = this.determineValue(json[key], model[key])
    })
  }

  private static determineValue<T, J extends ObjMap<any>>(jsonValue: any, defaultValue: any): any {
    let value = null
    if (ObjectUtil.isNullOrDefined(jsonValue)) {
      value = defaultValue
    } else if (ObjectUtil.isObject(jsonValue)) {
      value = ObjectUtil.assignDeep({}, defaultValue, jsonValue)
    } else {
      value = jsonValue
    }
    return value
  }

  static instanceToJson<T, J extends ObjMap<any>>(instance: Jsonified<T, J>, withHiddenFields: boolean) {
    const model = instance.getModel()
    const json = <any>{}
    ObjectUtil.keys(model).forEach((key) => {
      if (withHiddenFields || JsonUtil.isLegalFirebaseKey(key)) {
        const value = instance[key]
        json[key] = value
        if (value) {
          if (ObjectUtil.isFunction(value['toJson'])) {
            json[key] = value.toJson(withHiddenFields)
          } else if (ObjectUtil.isObject(value)) {
            json[key] = JsonUtil.mapToJson(value, withHiddenFields)
          }
        }
      }
    })
    return json
  }


  static mapToJson<J>(map: ObjMap<J>, withHiddenFields: boolean): ObjMap<J> {
    const json = {}
    ObjectUtil.entries(map).forEach((entry: MapEntry<ToJson<J>>) => {
      let v: any = entry.value
      if (v && v['toJson'] && ObjectUtil.isFunction(v['toJson'])) {
        v = v.toJson(withHiddenFields)
      }
      json[entry.key] = v
    })
    return json
  }

  static keyedArrayToJsonMap<J>(array: ToJson<J>[], withHiddenFields: boolean, keyField: string = '$key'): ObjMap<J> {
    const json = {}
    array.forEach(entry => {
      json[entry[keyField]] = entry.toJson(withHiddenFields)
    })
    return json
  }

  static removeIllegalFirebaseKeys<T>(obj: T): T {
    const cleanObj: T = <T>{}
    Object.keys(obj).forEach((key) => {
      const v = obj[key]
      if (JsonUtil.isLegalFirebaseKey(v)) {
        cleanObj[key] = v
      }
    })
    return cleanObj
  }

  static isLegalFirebaseKey(key: string): boolean {
    return key !== null && key !== undefined && !key.startsWith('$')
  }


}
