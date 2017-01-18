import {AuthUser, AuthRole, AuthPermission} from "@tangential/media-types";
import {RoleService} from "./role/role-service";
import {PermissionService} from "./permission/permission-service";
import {UserService} from "./user/user-service";

export const cleanupPermissions = function (permissionService: PermissionService): Promise<void> {
  return permissionService.valuesOnce().then((permissions: AuthPermission[]) => {
    let promises = []
    permissions.forEach((permission) => {
      if (permission.$key.startsWith("SPEC_RANDOM")) {
        promises.push(permissionService.remove(permission.$key))
      }
    })
    return Promise.all(promises)
  })
}

export const cleanupRoles = function (roleService: RoleService) {
  return roleService.valuesOnce().then((roles: AuthRole[]) => {
    let promises = []
    roles.forEach((role) => {
      if (role.$key.startsWith("SPEC_RANDOM")) {
        promises.push(roleService.remove(role.$key))
      }
    })
    return Promise.all(promises)
  })
}

export const cleanupUsers = function (userService: UserService) {
  return userService.valuesOnce().then((users: AuthUser[]) => {
    let promises = []
    users.forEach((user) => {
      if (user.$key.startsWith("SPEC_RANDOM")) {
        promises.push(userService.remove(user.$key))
      }
    })
    return Promise.all(promises)
  })
}
