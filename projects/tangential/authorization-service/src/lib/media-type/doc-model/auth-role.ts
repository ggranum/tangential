import {Database} from '@firebase/database'
import {child} from 'firebase/database'
import {AuthSettingsFirebaseRef} from './auth-settings';
export type AuthRoleKey = string

export const AuthRolesFirebaseRef = function (db: Database) {
  return child(AuthSettingsFirebaseRef(db), 'roles')
}

export const AuthRolePermissionsFirebaseRef = function (db: Database) {
  return child(AuthSettingsFirebaseRef(db), 'rolePermissions')
}


export interface AuthRoleDm {
  $key?: AuthRoleKey
  createdMils?: number
  editedMils?: number
  description?: string
  orderIndex?: number
}

export type RolePermissionsDm = { [roleKey: string]: { [permissionKey: string]: boolean } }
