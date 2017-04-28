import {AuthPermission, AuthRole, AuthUser} from '@tangential/authorization-service'
import {PermissionService} from './permission/permission-service'
import {RoleService} from './role/role-service'
import {UserService} from './user/user-service'

export const cleanupPermissions = function (permissionService: PermissionService): Promise<AuthPermission[]> {
  return permissionService.valuesOnce().then((permissions: AuthPermission[]) => {
    const promises = []
    permissions.forEach((permission) => {
      if (permission.$key.startsWith('SPEC_RANDOM')) {
        promises.push(permissionService.remove(permission.$key))
      }
    })
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
  return userService.valuesOnce().then((users: AuthUser[]) => {
    const promises = []
    users.forEach((user) => {
      if (user.$key.startsWith('SPEC_RANDOM')) {
        promises.push(userService.remove(user.$key))
      }
    })
    return Promise.all(promises)
  })
}
