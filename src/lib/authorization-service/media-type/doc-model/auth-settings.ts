import * as firebase from 'firebase'
import {AuthRoleDm, RolePermissionsDm} from './auth-role';
import {AuthPermissionDm} from './auth-permission';
import {AuthConfigurationDm} from './auth-configuration';
import {AuthFirebaseRef} from './auth';

export const AuthSettingsFirebaseRef = function (db: firebase.database.Database) {
  return AuthFirebaseRef(db).child('settings/')
}

export interface AuthSettingsDm {
  configuration: AuthConfigurationDm
  permissions: { [key: string]: AuthPermissionDm }
  roles: { [key: string]: AuthRoleDm }
  rolePermissions: RolePermissionsDm
}
