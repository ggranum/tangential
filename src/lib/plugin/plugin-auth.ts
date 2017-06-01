import {
  AuthPermission,
  AuthRole
} from '@tangential/authorization-service'
import {ObjectUtil} from '@tangential/core'

export type PermissionsByKey = { [key: string]: AuthPermission }
export type RolesByKey = { [key: string]: AuthRole }

export class PluginAuth {

  private _permissions: PermissionsByKey
  private _roles: RolesByKey


  constructor(permissions: PermissionsByKey, roles: RolesByKey) {
    this._permissions = permissions
    this._roles = roles
  }

  /**
   * Permissions that this Plugin will add to the auth tables.
   * These permissions will also be granted to the Administrator role, if one exists.
   * A plugin does not need to define additional permissions. However, if it does, the installing user will require the 'Add Permission' and
   * 'Grant Permission' permissions.
   */
  getPermissions(): PermissionsByKey {
    return ObjectUtil.assignDeep({}, this._permissions)
  }


  /**
   * Roles that this Plugin will add to the auth tables.
   * These Roles will also be granted to the Administrator account, if one exists.
   * As with Permissions, additional Roles are not required. If the plugin has new roles to add, the installing user will require the
   * 'Add Role' and 'Grant Role' permissions.
   */
  getRoles(): RolesByKey {
    return ObjectUtil.assignDeep({}, this._roles)
  }
}
