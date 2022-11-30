import {
  AuthPermission,
  AuthRole
} from '../../../../projects/tangential/authorization-service/src/lib'
import {PluginAuth} from '../../../../projects/tangential/plugin/src/lib'

type AppPermissionsType = {
  addPermission: AuthPermission
  modifyPermission: AuthPermission
  removePermission: AuthPermission
  revokePermission: AuthPermission
  addUser: AuthPermission
  modifyUser: AuthPermission
  removeUser: AuthPermission
  viewUsers: AuthPermission
  grantPermission: AuthPermission
  modifyOwnProfile: AuthPermission
  registerOwnAccount: AuthPermission
  grantRole: AuthPermission
  addRole: AuthPermission
  modifyRole: AuthPermission
  removeRole: AuthPermission
  revokeRole: AuthPermission
}
export const AppPermissions:AppPermissionsType = {
  addPermission     : AuthPermission.withKey('ADD PERMISSION').withDescription('Create new permissions'),
  modifyPermission  : AuthPermission.withKey('MODIFY PERMISSION'),
  removePermission  : AuthPermission.withKey('REMOVE PERMISSION'),
  revokePermission  : AuthPermission.withKey('REVOKE PERMISSION'),
  addUser           : AuthPermission.withKey('ADD USER').withDescription('Create or import users. Not required to register own guest account.'),
  modifyUser        : AuthPermission.withKey('MODIFY USER'),
  removeUser        : AuthPermission.withKey('REMOVE USER'),
  viewUsers         : AuthPermission.withKey('VIEW USERS').withDescription('View other user accounts aside from own account.'),
  grantPermission   : AuthPermission.withKey('GRANT PERMISSION'),
  modifyOwnProfile  : AuthPermission.withKey('MODIFY OWN PROFILE'),
  registerOwnAccount: AuthPermission.withKey('REGISTER OWN ACCOUNT'),
  grantRole         : AuthPermission.withKey('GRANT ROLE'),
  addRole           : AuthPermission.withKey('ADD ROLE').withDescription('Create a new role.'),
  modifyRole        : AuthPermission.withKey('MODIFY ROLE'),
  removeRole        : AuthPermission.withKey('REMOVE ROLE'),
  revokeRole        : AuthPermission.withKey('REVOKE ROLE'),
}

const allPermissions = Object.keys(AppPermissions).map((key:string) => (AppPermissions as any)[key] as AuthPermission)
export const AppRoles = {
  administrator : new AuthRole("Administrator").withPermissions(allPermissions)
}



