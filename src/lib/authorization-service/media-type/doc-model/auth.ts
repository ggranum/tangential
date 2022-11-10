import * as firebase from 'firebase'
import {AuthEventsDm} from './auth-events';
import {AuthSettingsDm} from './auth-settings';
import {AuthUserDm} from './auth-user';


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


export const AuthFirebaseRef = function (db: firebase.database.Database): firebase.database.Reference {
  return db.ref('/auth')
}

export const AuthEffectivePermissionsRef = function (db: firebase.database.Database): firebase.database.Reference {
  return AuthFirebaseRef(db).child('ep')
}

export const AuthGrantedPermissionsRef = function (db: firebase.database.Database): firebase.database.Reference {
  return AuthFirebaseRef(db).child('grantedPermissions')
}

export const AuthGrantedRolesRef = function (db: firebase.database.Database): firebase.database.Reference {
  return AuthFirebaseRef(db).child('grantedRoles')
}
