import {
  AuthPermission,
  AuthRole
} from '@tangential/authorization-service'
import {PluginAuth} from '@tangential/plugin'


export const AppPermissions = {
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

const allPermissions = Object.keys(AppPermissions).map(key => AppPermissions[key])
export const AppRoles = {
  administrator : new AuthRole("Administrator").withPermissions(allPermissions)
}



export class AppAuth extends PluginAuth {

  constructor() {
    super(AppPermissions, null)
  }

}
