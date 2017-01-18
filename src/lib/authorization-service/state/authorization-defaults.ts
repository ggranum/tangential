import {AuthRole, AuthPermission, AuthUser} from "@tangential/media-types";
import {ObjMap, ObjMapUtil, OneToManyReferenceMap} from "@tangential/common";
import {Injectable} from "@angular/core";
import {AuthorizationModel} from "./authorization-model";


@Injectable()
export abstract class AuthorizationDefaultsProvider {
  abstract getDefaultPermissions(): ObjMap<AuthPermission>
  abstract getDefaultRoles(): {roles: ObjMap<AuthRole>, rolePermissions: OneToManyReferenceMap}
  abstract getDefaultUsers(): {users: ObjMap<AuthUser>, userPermissions: OneToManyReferenceMap, userRoles: OneToManyReferenceMap}
  abstract getDefaultAdministratorUser(): {user: AuthUser, userRoles: OneToManyReferenceMap}
  abstract getDefaultAnonymousUser(): {user: AuthUser, userRoles: OneToManyReferenceMap}
}

@Injectable()
export class DefaultAuthorizationDefaultsProvider extends AuthorizationDefaultsProvider {


  getDefaultAuthorizationModel(): AuthorizationModel {
    let roles = this.getDefaultRoles()
    let users = this.getDefaultUsers()

    return {
      permissions: this.getDefaultPermissions(),
      roles: roles.roles,
      role_permissions: roles.rolePermissions,
      users: users.users,
      user_granted_permissions: users.userPermissions,
      user_effective_permissions: users.userPermissions,
      user_roles: users.userRoles,
    }
  }

  getDefaultPermissions(): ObjMap<AuthPermission> {
    let permissions = [
      new AuthPermission({
        $key: "ADD PERMISSION",
        createdMils: 1481726286361,
        "description": "",
        "orderIndex": 1
      }),
      new AuthPermission({
        $key: "ADD ROLE",
        createdMils: 1481726286361,
        "description": "",
        "orderIndex": 10
      }),
      new AuthPermission({
        $key: "ADD USER",
        createdMils: 1481726286361,
        "description": "",
        "orderIndex": 4
      }),
      new AuthPermission({
        $key: "ASSIGN ADMIN ROLE",
        createdMils: 1481726286361,
        "description": "",
        "orderIndex": 15
      }),
      new AuthPermission({
        $key: "GRANT USER PERMISSION",
        createdMils: 1481726286361,
        "description": "",
        "orderIndex": 13
      }),
      new AuthPermission({
        $key: "MODIFY PERMISSION",
        createdMils: 1481726286361,
        "description": "",
        "orderIndex": 2
      }),
      new AuthPermission({
        $key: "MODIFY ROLE",
        createdMils: 1481726286361,
        "description": "",
        "orderIndex": 11
      }),
      new AuthPermission({
        $key: "MODIFY USER",
        createdMils: 1481726286361,
        "description": "",
        "orderIndex": 5
      }),
      new AuthPermission({
        $key: "MODIFY OWN PROFILE",
        createdMils: 1481726286361,
        "description": "",
        "orderIndex": 20
      }),
      new AuthPermission({
        $key: "REMOVE PERMISSION",
        createdMils: 1481726286361,
        "description": "",
        "orderIndex": 3
      }),
      new AuthPermission({
        $key: "REMOVE ROLE",
        createdMils: 1481726286361,
        "description": "",
        "orderIndex": 12
      }),
      new AuthPermission({
        $key: "REMOVE USER",
        createdMils: 1481726286361,
        "description": "",
        "orderIndex": 6
      }),
      new AuthPermission({
        $key: "REVOKE USER PERMISSION",
        createdMils: 1481726286361,
        "description": "",
        "orderIndex": 14
      }),
      new AuthPermission({
        $key: "REGISTER OWN ACCOUNT",
        createdMils: 1481726286361,
        "description": "",
        "orderIndex": 15
      })]
    return ObjMapUtil.fromKeyedEntityArray(permissions)
  }

  getDefaultRoles(): {roles: ObjMap<AuthRole>, rolePermissions: OneToManyReferenceMap} {
    let defaultPerms = this.getDefaultPermissions()
    let rolePermissions: OneToManyReferenceMap = {}
    let administrator = new AuthRole({
      $key: "Administrator",
      description: "Default Administrator Role",
      createdMils: 1481726286361,
    })

    let registered = new AuthRole({
      $key: "Registered Visitor",
      description: "Default non-anonymous role. Any user that has created an account, or has had an account created " +
      "for them.",
      createdMils: 1481726286361,
    })

    let anonymous = new AuthRole({
      $key: "Anonymous",
      description: "Default anonymous role. Frequently has the right to create their own account.",
      createdMils: 1481726286361,
    })



    let rolesAry = [administrator, registered, anonymous]
    rolePermissions[administrator.$key] = ObjMapUtil.toTruthMap(defaultPerms)

    rolePermissions[registered.$key] = {}
    // referencing .$key throws NPE if missing instead of adding bad permission
    rolePermissions[registered.$key][defaultPerms["MODIFY OWN PROFILE"].$key] = true

    rolePermissions[anonymous.$key] = {}
    rolePermissions[anonymous.$key][defaultPerms["REGISTER OWN ACCOUNT"].$key] = true

    return {
      roles: ObjMapUtil.fromKeyedEntityArray(rolesAry),
      rolePermissions: rolePermissions
    }
  }

  getDefaultUsers(): {users: ObjMap<AuthUser>, userPermissions: OneToManyReferenceMap, userRoles: OneToManyReferenceMap} {
    let users: ObjMap<AuthUser> = {}

    let admin = this.getDefaultAdministratorUser()
    users[admin.user.$key] = admin.user

    let anonymous = this.getDefaultAnonymousUser()
    users[anonymous.user.$key] = anonymous.user

    let userRoles = Object.assign({}, admin.userRoles, anonymous.userRoles)

    return {users: users, userRoles: userRoles, userPermissions: {}}
  }

  getDefaultAdministratorUser(): {user: AuthUser, userRoles: OneToManyReferenceMap} {
    let user = new AuthUser({
      $key: "Administrator",
      createdMils: 1481726286370,
      displayName: "Administrator Account",
      email: "not-configured@example.com",
    })

    let userRoles: OneToManyReferenceMap = {}
    userRoles[user.$key] = {}
    userRoles[user.$key][this.getDefaultRoles().roles["Administrator"].$key] = true

    return {user: user, userRoles: userRoles}
  }

  getDefaultAnonymousUser(): {user: AuthUser, userRoles: OneToManyReferenceMap} {
    let user = new AuthUser({
      $key: "Anonymous",
      createdMils: 1481726286371,
      displayName: "Anonymous",
      email: "NA@example.com",
    })

    let userRoles: OneToManyReferenceMap = {}
    userRoles[user.$key] = {}
    userRoles[user.$key][this.getDefaultRoles().roles["Anonymous"].$key] = true


    return {user: user, userRoles: userRoles}
  }
}
