import {Jsonified, ObjectUtil} from '@tangential/core'
import {StampedMediaType, StampedMediaTypeJson} from '@tangential/media-types'

export interface AuthRoleJson extends StampedMediaTypeJson {
  description?: string
  orderIndex?: number
}

const Model: AuthRoleJson = {
  description: null,
  orderIndex:  0
}

export class AuthRole extends StampedMediaType implements Jsonified<AuthRole, AuthRoleJson>, AuthRoleJson {
  static $model: AuthRoleJson = ObjectUtil.assignDeep({}, StampedMediaType.$model, Model)
  $key?: string
  description?: string
  createdMils?: number
  orderIndex?: number

  constructor(config: AuthRoleJson, key?: string) {
    super(config, key)
  }

  static guard(value: AuthRole | string): value is AuthRole {
    return !(typeof value === 'string') && (<AuthRole>value).$key !== undefined;
  }
}
