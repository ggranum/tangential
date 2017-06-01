import {generatePushID} from '@tangential/core'
import {
  AuthPermissionDm,
  AuthPermissionKey
} from '../doc-model/auth-permission'

export interface AuthPermissionCfg {
  $key?: string
  createdMils?: number
  description?: string
  editedMils?: number
  orderIndex?: number
}

export class AuthPermission {
  $key: string
  createdMils: number = Date.now()
  description: string
  editedMils: number = Date.now()
  orderIndex: number

  constructor($key?: string) {
    this.$key = $key
  }

  withDescription(description:string) {
    this.description = description
    return this
  }

  static withKey($key: string) {
    return new AuthPermission($key)
  }


  static guard(value: AuthPermission | string): value is AuthPermission {
    return value instanceof AuthPermission
  }

  static from(cfg: AuthPermission | AuthPermissionCfg, key?: AuthPermissionKey) {
    cfg = cfg || <AuthPermissionCfg>{}
    key = key || cfg.$key || generatePushID()
    const perm = new AuthPermission(key)
    perm.createdMils = cfg.createdMils || perm.createdMils
    perm.editedMils = cfg.editedMils || perm.editedMils
    perm.description = cfg.description || perm.description
    perm.orderIndex = cfg.orderIndex || perm.orderIndex
    return perm
  }
}


export class AuthPermissionTransform {
  static fromDocModel(dm: AuthPermissionDm, key?: string): AuthPermission {
    key = key || dm.$key || generatePushID()
    /* Safe to use the AuthPermission.from call, as the document model and the cfg are the same. Not even close to always true. */
    dm.$key = key
    return AuthPermission.from(dm)
  }

  static toDocModel(authPermission: AuthPermission) {
    return {
      createdMils: authPermission.createdMils,
      editedMils:  authPermission.editedMils,
      description: authPermission.description,
      orderIndex:  authPermission.orderIndex,
    }
  }

  static toDocModels(permissions: AuthPermission[]) {
    return permissions.map(cm => AuthPermissionTransform.toDocModel(cm))
  }
}
