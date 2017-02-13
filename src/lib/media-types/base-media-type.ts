import {
  generatePushID,
  ObjectUtil
} from "@tangential/common";
export interface BaseMediaTypeIF {
  $key?: string
  _createdMils: number
  _editedMils: number
}

export class BaseMediaType implements BaseMediaTypeIF {
  $key?: string
  _createdMils: number
  _editedMils: number


  constructor(config?: any) {
    config = config || {}
    this.$key = config.$key || generatePushID()
    this._createdMils = config._createdMils || Date.now()
    this._editedMils = config._editedMils || this._createdMils
  }


  toJson<T>(withHiddenFields?: boolean, baseJson?: T): T {
    let json: any = baseJson || {}
    json._createdMils = this._createdMils
    json._editedMils = this._editedMils
    return withHiddenFields !== true ? ObjectUtil.removeIllegalFirebaseKeys(json) : ObjectUtil.removeNullish(json)
  }


}
