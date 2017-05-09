import {ObjectUtil} from '@tangential/core';
export class TransformUtil {


  static firstExisting(...obj: any[]) {
    let result
    for (let i = 0; i < obj.length; i++) {
      if(ObjectUtil.exists(obj[i])){
        result = obj[i]
        break
      }
    }
    return result
  }
}
