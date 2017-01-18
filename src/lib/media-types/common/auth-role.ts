import {ObjectUtil} from "@tangential/common";
import {MediaType, TypeDescriptor} from "../media-type";

export const __AuthRole: TypeDescriptor = {
  name: 'auth-role',
  version: 1,
  prefix: 'vnd'
}

export class AuthRoleType implements MediaType {
  descriptor: TypeDescriptor = __AuthRole;
  definition: typeof AuthRole = AuthRole
}

export interface AuthRoleIF {
  $key?: string
  description?: string
  createdMils?: number
  orderIndex?: number
}

export class AuthRole implements AuthRoleIF {
  $key?: string
  description?: string
  createdMils?: number
  orderIndex?: number

  constructor(config:AuthRoleIF, ) {
    this.$key = config.$key
    this.description = config.description
    this.orderIndex = config.orderIndex
    this.createdMils = config.createdMils || Date.now()
  }

  toJson(withHiddenFields?:boolean):AuthRoleIF {
    let json:AuthRoleIF = {
      description: this.description,
      createdMils: this.createdMils,
      orderIndex: this.orderIndex
    }
    if(withHiddenFields === true){
      json.$key = this.$key
    }
    return ObjectUtil.removeNullish(json)
  }

  static guard(value: AuthRole | string ): value is AuthRole {
    return (<AuthRole>value).$key !== undefined;
  }
}
