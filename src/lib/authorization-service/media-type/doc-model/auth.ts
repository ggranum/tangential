import {AuthUserDm} from './auth-user';
import {AuthSettingsDm} from './auth-settings';
import {AuthEventsDm} from './auth-events';





export type UserPermissionGrantsDm = { [uid: string]: { [permissionKey: string]: boolean } }
export type UserRoleGrantsDm = { [uid: string]: { [roleKey: string]: boolean } }

export interface AuthDm {
  settings: AuthSettingsDm
  ep: UserPermissionGrantsDm
  users: { [uid: string]: AuthUserDm }
  grantedPermissions: UserPermissionGrantsDm
  grantedRoles: UserRoleGrantsDm
  events: AuthEventsDm
}



export const AuthFirebaseRef = function(db: firebase.database.Database):firebase.database.Reference {
  return db.ref('/auth')
}

export const AuthEffectivePermissionsRef = function(db: firebase.database.Database):firebase.database.Reference {
  return AuthFirebaseRef(db).child('ep')
}

export const AuthGrantedPermissionsRef = function(db: firebase.database.Database):firebase.database.Reference {
  return AuthFirebaseRef(db).child('grantedPermissions')
}

export const AuthGrantedRolesRef = function(db: firebase.database.Database):firebase.database.Reference {
  return AuthFirebaseRef(db).child('grantedRoles')
}
