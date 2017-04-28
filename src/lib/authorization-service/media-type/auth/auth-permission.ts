import {Jsonified, ObjectUtil} from '@tangential/core'
import {StampedMediaType, StampedMediaTypeJson} from '@tangential/media-types'


export interface AuthPermissionJson extends StampedMediaTypeJson {
  description?: string
  orderIndex?: number
}

const Model: AuthPermissionJson = {
  description: null,
  orderIndex:  null,
}

export class AuthPermission extends StampedMediaType implements Jsonified<AuthPermission, AuthPermissionJson>, AuthPermissionJson {
  static $model: AuthPermissionJson = ObjectUtil.assignDeep({}, StampedMediaType.$model, Model)
  description?: string;
  orderIndex?: number

  constructor(config: AuthPermissionJson, key?: string) {
    super(config, key)
  }

  static guard(value: AuthPermission | string): value is AuthPermission {
    return !(typeof value === 'string') && (<AuthPermission>value).$key !== undefined;
  }

}
