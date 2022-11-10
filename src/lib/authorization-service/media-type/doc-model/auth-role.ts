import * as firebase from 'firebase'
import {AuthSettingsFirebaseRef} from './auth-settings';
export type AuthRoleKey = string

export const AuthRolesFirebaseRef = function (db: firebase.database.Database) {
  return AuthSettingsFirebaseRef(db).child('roles')
}

export const AuthRolePermissionsFirebaseRef = function (db: firebase.database.Database) {
  return AuthSettingsFirebaseRef(db).child('rolePermissions')
}


export interface AuthRoleDm {
  $key?: AuthRoleKey
  createdMils?: number
  editedMils?: number
  description?: string
  orderIndex?: number
}

export type RolePermissionsDm = { [roleKey: string]: { [permissionKey: string]: boolean } }
