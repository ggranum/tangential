import {generatePushID, ObjectUtil, ObjMap} from '@tangential/core';
import {AuthRoleDm} from '../doc-model/auth-role';
import {AuthPermission} from './auth-permission';
import {AuthRoleKey} from '../doc-model/auth-role';
import {RolePermissionsDm} from '../doc-model/auth-role';

export interface AuthRoleCfg {
  $key ?: string
  description ?: string
  createdMils ?: number
  editedMils ?: number
  orderIndex ?: number

  permissions ?: AuthPermission[]
}

export class AuthRole {

  $key: string
  description: string
  createdMils: number = Date.now()
  editedMils: number = Date.now()
  orderIndex: number

  permissions: AuthPermission[]


  constructor($key?: string) {
    this.$key = $key
  }

  static guard(value: AuthRole | string): value is AuthRole {
    return value instanceof AuthRole
  }


  static from(cfg: AuthRole | AuthRoleCfg): AuthRole {
    const role = new AuthRole(cfg.$key || generatePushID())
    role.$key = cfg.$key
    role.permissions = cfg.permissions || role.permissions
    role.description = cfg.description || role.description
    role.createdMils = cfg.createdMils || role.createdMils
    role.editedMils = cfg.editedMils || role.editedMils
    role.orderIndex = cfg.orderIndex || role.orderIndex
    return role

  }
}

export class AuthRoleTransform {

  static fromDocModel(dm: AuthRoleDm,
                      key: string,
                      rolePermissions: { [permissionKey: string]: boolean },
                      allPermissions: ObjMap<AuthPermission>): AuthRole {
    const cdm = AuthRoleTransform.fragmentFromDocModel(dm, key)
    cdm.permissions = ObjectUtil.keys(rolePermissions).map(permKey => allPermissions[permKey])
    return cdm
  }

  static fragmentFromDocModel(dm: AuthRoleDm, key?: AuthRoleKey): AuthRole {
    dm = dm || {}
    key = key || dm.$key || generatePushID()
    const cdm = new AuthRole(key)
    cdm.description = dm.description
    cdm.orderIndex = dm.orderIndex
    cdm.createdMils = dm.createdMils
    cdm.editedMils = dm.editedMils
    return cdm
  }

  static toDocModel(role: AuthRole):AuthRoleDm {
    return {
      description: role.description,
      orderIndex: role.orderIndex,
      createdMils: role.createdMils,
      editedMils: role.editedMils,
    }
  }

  static toDocModels(roles: AuthRole[]):AuthRoleDm[] {
    return roles.map(cm => AuthRoleTransform.toDocModel(cm))
  }

  static toRolePermissionDocModels(roles: AuthRole[]):RolePermissionsDm {
    let rpDm:RolePermissionsDm = {}
    roles.forEach(role => {
      const permTruthMap = {}
      role.permissions.forEach(perm => permTruthMap[perm.$key] = true)
      rpDm[role.$key] = permTruthMap
    })
    return rpDm
  }
}
