import {AuthEventsDm} from './auth-events';
import {AuthSettingsDm} from './auth-settings';
import {AuthUserDm} from './auth-user';

import {Database, DatabaseReference} from '@firebase/database'
import {ref, child} from 'firebase/database'


export type UserPermissionGrantsDm = { [uid: string]: { [permissionKey: string]: boolean } }
export type UserRoleGrantsDm = { [uid: string]: { [roleKey: string]: boolean } }

export interface AuthDm {
  ep: UserPermissionGrantsDm
  events: AuthEventsDm
  grantedPermissions: UserPermissionGrantsDm
  grantedRoles: UserRoleGrantsDm
  settings: AuthSettingsDm
  users: { [uid: string]: AuthUserDm }
}


export const AuthFirebaseRef = function (db: Database): DatabaseReference {
  return ref(db, '/auth')
}

export const AuthEffectivePermissionsRef = function (db: Database): DatabaseReference {
  return child(AuthFirebaseRef(db), 'ep')
}

export const AuthGrantedPermissionsRef = function (db: Database): DatabaseReference {
  return child(AuthFirebaseRef(db), 'grantedPermissions')
}

export const AuthGrantedRolesRef = function (db: Database): DatabaseReference {
  return child(AuthFirebaseRef(db), 'grantedRoles')
}
