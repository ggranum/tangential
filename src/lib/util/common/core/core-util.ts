import {ObjMap} from "../lang/omap";


export type MapEntry<T> = { key: string, value: T }

export class ObjectUtil {


  /**
   * Null safe version of Object.keys.
   * @param map
   * @returns {string[]} The keys for the map, or an empty array if the argument provided is falsy.
   */
  static keys<T>(map: ObjMap<T>): string[] {
    return Object.keys(map || {})
  }

  /**
   * Provide a map of keys such that 'map[key]' provides a literal true value if the key is present, even if the value
   * on the source map is falsy.
   */
  static truthMap<T>(map: ObjMap<T>): ObjMap<boolean> {
    let result: ObjMap<boolean> = {}
    Object.keys(map || {}).forEach(key => result[key] = true)
    return result
  }

  /**
   * Expand the map into an array of key-value pairs.
   * @param {ObjMap<T>} map
   * @returns MapEntry<T>
   */
  static entries<T>(map: ObjMap<T> | any): MapEntry<T>[] {
    return Object.keys(map || {}).map((key) => {
      return {key: key, value: map[key]}
    })
  }

  /**
   * Provide the values of the map.
   * @param {ObjMap<T>} map
   * @returns MapEntry<T>
   */
  static values<T>(map: ObjMap<T> | any): T[] {
    return Object.keys(map || {}).map((key) => {
      return map[key]
    })
  }

  static isObject(value): boolean {
    return (typeof value === 'object' || value.constructor === Object)
  }

  static isFunction(value): boolean {
    return (typeof value === 'function' || value instanceof Function)
  }

  static isNullOrDefined(value): boolean {
    return value === null || value === undefined
  }

  static assignDeep(target: any, ...sources: any[]): any {
    target = target || {}
    for (let i = 0, L = sources.length; i < L; i++) {
      let source = sources[i] || {}
      Object.keys(source).forEach(key => {
        let value = source[key]
        if (value && ObjectUtil.isObject(value)) {
          target[key] = ObjectUtil.assignDeep(target[key] || {}, value)
        } else {
          target[key] = value
        }
      })
    }
    return target
  }


  static removeNullish<T>(obj: T): T {
    let cleanObj: T = <T>{}
    Object.keys(obj).forEach((key) => {
      let v = obj[key]
      if (v !== null && v !== undefined) {
        cleanObj[key] = v
      }
    })
    return cleanObj
  }

  static removeIllegalFirebaseKeys<T>(obj: T): T {
    let cleanObj: T = <T>{}
    Object.keys(obj).forEach((key) => {
      let v = obj[key]
      if (v !== null && v !== undefined && !key.startsWith('$')) {
        cleanObj[key] = v
      }
    })
    return cleanObj
  }
}

export const cleanFirebaseMap = function <T>(firebaseList: ObjMap<T>, deep?: boolean): ObjMap<T> {
  let result: ObjMap<T> = {}

  Object.keys(firebaseList).forEach((key: string) => {
    if (key[0] !== '$') {
      if (deep && firebaseList[key] instanceof Object) {
        result[key] = <any>cleanFirebaseMap(<any>firebaseList[key], true)
      } else {
        result[key] = firebaseList[key]
      }
    }
  })
  return result
}
export const pathExists = (object: any, path: string): any => {
  let parts = path.split('\.')
  let exists = true
  let obj = object
  for (let i = 0; i < parts.length; i++) {
    obj = obj[parts[i]]
    if (obj === undefined) {
      exists = false
      break
    }
  }
  return exists
}

export const ensureExists = (object: any, path: string, value: any = true): any => {
  let parts = path.split('\.')
  let obj = object
  for (let i = 0; i < parts.length - 1; i++) {
    let key = parts[i]
    if (obj[key] === undefined) {
      obj[key] = {}
    }
    obj = obj[key]
  }
  let lastKey = parts[parts.length - 1]
  if (obj[lastKey] === undefined) {
    obj[lastKey] = value
  }
  return obj[lastKey]
}

export const removeIfExists = (object: any, path: string): boolean => {
  let parts = path.split('\.')
  let obj = object
  let existed = true
  for (let i = 0; i < parts.length - 1; i++) {
    obj = obj[parts[i]]
    if (obj === undefined) {
      existed = false
      break
    }
  }
  if (existed) {
    let lastKey = parts[parts.length - 1]
    existed = obj[lastKey] !== undefined
    if (existed) {
      delete obj[lastKey]
    }
  }
  return existed
}

export const safe = (fn: () => any) => {
  try {
    return fn()
  } catch (e) {
    return null
  }
}

export const eachKey = <T>(objMap: T, fn: (arg?: T, key?: string) => any) => {
  Object.keys(objMap).forEach((key: string) => {
    fn(objMap[key], key)
  })
}


export interface Duo<X, Y> {
  x: X
  y: Y
}
