import {ObjectUtil, ToJson, Keyed} from "@tangential/common";

import {MediaType, TypeDescriptor} from "../media-type";

export const __AuthPermission: TypeDescriptor = {
  name: 'auth-permission',
  version: 1,
  prefix: 'vnd'
}

export class AuthPermissionType implements MediaType {
  descriptor: TypeDescriptor = __AuthPermission;
  definition: typeof AuthPermission = AuthPermission
}


export interface AuthPermissionIF {
  $key?: string
  description?: string
  createdMils?: number
  orderIndex?: number
}

export class AuthPermission implements AuthPermissionIF, Keyed, ToJson {
  $key?: string
  description?: string;
  createdMils?: number
  orderIndex?: number


  constructor(config: AuthPermissionIF) {
    this.$key = config.$key
    this.description = config.description
    this.createdMils = config.createdMils || Date.now()
    this.orderIndex = config.orderIndex
  }

  toJson(includeHidden?: boolean): AuthPermissionIF {
    let json: AuthPermissionIF = {
      description: this.description,
      createdMils: this.createdMils,
      orderIndex: this.orderIndex
    }
    if (includeHidden === true) {
      json.$key = this.$key
    }
    return ObjectUtil.removeNullish(json)
  }

}
