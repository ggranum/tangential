import {ObjMap} from '@tangential/core'
import {AuthPermissionJson} from './auth-permission'
import {AuthRoleJson} from './auth-role'
import {AuthUserIF} from './auth-user'


export class AuthDocModel {
  permissions: ObjMap<AuthPermissionJson>
  role_permissions: { [roleKey: string]: { [permissionKey: string]: boolean } }
  roles: ObjMap<AuthRoleJson>
  user_effective_permissions: { [userKey: string]: { [permissionKey: string]: boolean } }
  user_permissions: { [userKey: string]: { [permissionKey: string]: boolean } }
  user_roles: { [userKey: string]: { [roleKey: string]: boolean } }
  users: ObjMap<AuthUserIF>


  constructor(model: AuthDocModel) {
    this.permissions = model.permissions || {}
    this.role_permissions = model.role_permissions || {}
    this.roles = model.roles || {}
    this.user_effective_permissions = model.user_effective_permissions || {}
    this.user_permissions = model.user_permissions || {}
    this.user_roles = model.user_roles || {}
    this.users = model.users || {}
  }

}
