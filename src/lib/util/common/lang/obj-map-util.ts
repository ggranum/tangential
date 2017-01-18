import {ObjMap} from "./omap";
export class ObjMapUtil {

  static fromKeyedEntityArray<V>(values: V[], keyField: string = "$key"): ObjMap<V> {
    let m: ObjMap<V> = {}
    for (let i = 0; i < values.length; i++) {
      m[values[i][keyField]] = values[i]
    }
    return m
  }

  static toArray<V>(map: ObjMap<V>): V[] {
    return Object.keys(map).map((key) => {
      return map[key]
    })
  }

  static toKeyedEntityArray<V>(map: ObjMap<V>, keyField: string = "$key"): V[] {
    return Object.keys(map).map((key) => {
      let keyObj = {}
      keyObj[keyField] = key
      return Object.assign({}, map[key], keyObj)
    })
  }

  static toTruthMap<V>(map: ObjMap<V>): ObjMap<boolean> {
    let result: ObjMap<boolean> = {}
    Object.keys(map).forEach((key) => {
      result[key] = true
    })
    return result
  }

  static addAll<V>(map: ObjMap<V>, mapB: ObjMap<V>, noOverwrite: boolean = false): ObjMap<V> {
    map = map || {}
    mapB = mapB || {}
    Object.keys(mapB).forEach((key: string) => {
      if (noOverwrite && map[key] !== undefined) {
        throw new Error(`Key already exists on map, cannot replace: ${key}.`)
      }
      map[key] = mapB[key]
    })
    return map
  }

  static removeAll<V>(map: ObjMap<V>, mapB: ObjMap<V>) {
    Object.keys(mapB).forEach((key: string) => {
      if (map[key] !== undefined) {
        delete map[key]
      }
    })
  }
}
