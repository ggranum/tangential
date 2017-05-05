import {AuthPermission, AuthRole, AuthUser, UserService} from '@tangential/authorization-service';
import {PermissionService} from './permission/permission-service';
import {RoleService} from './role/role-service';

export const cleanupPermissions = function (permissionService: PermissionService): Promise<AuthPermission[]> {
  return permissionService.permissions$().first().toPromise().then((permissions: AuthPermission[]) => {
    const promises = []
    const toDelete = []
    permissions.forEach((permission) => {
      if (permission.$key.startsWith('SPEC_RANDOM')) {
        toDelete.push(permission.$key)
        promises.push(permissionService.remove(permission.$key))
      }
    })
    console.log('cleanupPermissions', 'Remove permissions: ', "\n\t" + toDelete.join(",\n\t"))
    return Promise.all(promises)
  })
}

export const cleanupRoles = function (roleService: RoleService) {
  return roleService.valuesOnce().then((roles: AuthRole[]) => {
    const promises = []
    roles.forEach((role) => {
      if (role.$key.startsWith('SPEC_RANDOM')) {
        promises.push(roleService.remove(role.$key))
      }
    })
    return Promise.all(promises)
  })
}

export const cleanupUsers = function (userService: UserService) {
  return userService.awaitUsers$().toPromise().then((users: AuthUser[]) => {
    const promises = []
    users.forEach((user) => {
      if (user.$key.startsWith('SPEC_RANDOM')) {
        promises.push(userService.remove(user.$key))
      }
    })
    return Promise.all(promises)
  })
}
