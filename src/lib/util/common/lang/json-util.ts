import {MapEntry, ObjectUtil, ObjMap} from '@tangential/common'
import any = jasmine.any;

export interface ToJson<T> {
  toJson(withHiddenFields?: boolean): T
}


export interface Jsonified<T, J extends ObjMap<any>> extends ToJson<J> {
  getModel():J


}

export class JsonUtil {

  static applyJsonToInstance<T, J extends ObjMap<any>>(instance: Jsonified<T, J>, json: J) {
    let model = instance.getModel()
    json = json || <any>{}
    ObjectUtil.keys(model).forEach((key) => {
      instance[key] = this.determineValue(json[key], model[key])
    })
  }

  private static determineValue<T, J extends ObjMap<any>>(jsonValue: any, defaultValue: any):any {
    let value = null
    if(ObjectUtil.isNullOrDefined(jsonValue)){
      value = defaultValue
    }
    else if(ObjectUtil.isObject(jsonValue)){
      value = ObjectUtil.assignDeep({}, defaultValue, jsonValue)
    } else {
      value = jsonValue
    }
    return value
  }

  static instanceToJson<T, J extends ObjMap<any>>(instance: Jsonified<T,J>, withHiddenFields: boolean) {
    let model = instance.getModel()
    let json = <any>{}
    ObjectUtil.keys(model).forEach((key) => {
      if(withHiddenFields || JsonUtil.isLegalFirebaseKey(key)){
        let value = instance[key]
        json[key] = value
        if(value ){
          if(ObjectUtil.isFunction(value['toJson'])){
            json[key] = value.toJson(withHiddenFields)
          }
          else if( ObjectUtil.isObject(value)){
            json[key] = JsonUtil.mapToJson(value, withHiddenFields)
          }
        }
      }
    })
    return json
  }


  static mapToJson<J>(map: ObjMap<ToJson<J>>, withHiddenFields: boolean):ObjMap<J> {
    let json = {}
    ObjectUtil.entries(map).forEach((entry: MapEntry<ToJson<J>>) => {
      json[entry.key] = entry.value ? entry.value.toJson(withHiddenFields) : entry.value
    })
    return json
  }

  static keyedArrayToJsonMap<J>(array: ToJson<J>[], withHiddenFields: boolean, keyField: string = '$key'):ObjMap<J> {
    let json = {}
    array.forEach(entry => {
      json[entry[keyField]] = entry.toJson(withHiddenFields)
    })
    return json
  }

  static removeIllegalFirebaseKeys<T>(obj: T): T {
    let cleanObj: T = <T>{}
    Object.keys(obj).forEach((key) => {
      let v = obj[key]
      if (JsonUtil.isLegalFirebaseKey(v)) {
        cleanObj[key] = v
      }
    })
    return cleanObj
  }

  static isLegalFirebaseKey(key:string):boolean {
    return key !== null && key !== undefined && !key.startsWith('$')
  }


}
