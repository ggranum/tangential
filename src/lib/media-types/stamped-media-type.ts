import {Jsonified, ObjectUtil} from '@tangential/core'
import {BaseMediaType, BaseMediaTypeJson} from './base-media-type'


export interface StampedMediaTypeJson extends BaseMediaTypeJson {
  createdMils?: number
  editedMils?: number
}

const Model: StampedMediaTypeJson = {
  createdMils: null,
  editedMils:  null
}

export class StampedMediaType extends BaseMediaType implements Jsonified<StampedMediaType, StampedMediaTypeJson>, StampedMediaTypeJson {
  static $model: StampedMediaTypeJson = ObjectUtil.assignDeep({}, BaseMediaType.$model, Model)
  createdMils?: number
  editedMils?: number


  constructor(config: any, key?: string) {
    super(config, key)
    this.createdMils = config.createdMils || Date.now()
    this.editedMils = config.editedMils || this.createdMils
  }


}
