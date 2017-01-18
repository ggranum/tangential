import {ObjMap} from "@tangential/common";
//noinspection TypeScriptPreferShortImport
import {ObservableReference} from "./observable-reference";

export class ObservableObjMapReference<T> extends ObservableReference<ObjMap<T>, T> {

  constructor(path: string, fbApp: firebase.database.Database, childTransform?: (json: any, key: string) => T) {
    super(path,
      fbApp,
      (anyMap: ObjMap<any>, key: string) => {
          let tMap: ObjMap<T> = {}
          if (anyMap) {
            Object.keys(anyMap).forEach((key) => {
              try {
                tMap[key] = childTransform(anyMap[key], key)
              } catch (e) {
                console.error('ObservableReference#_fromSnapshot', key, anyMap[key], childTransform)
              }
            })
          }
          return tMap
      },
      childTransform)
  }


}
