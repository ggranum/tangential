import {AuthRoleDm, RolePermissionsDm} from './auth-role';
import {AuthPermissionDm} from './auth-permission';
import {AuthConfigurationDm} from './auth-configuration';
import {AuthFirebaseRef} from './auth';
import {Database} from '@firebase/database'
import {child} from 'firebase/database'


export const AuthSettingsFirebaseRef = function (db: Database) {
  return child(AuthFirebaseRef(db), 'settings/')
}

export interface AuthSettingsDm {
  configuration: AuthConfigurationDm
  permissions: { [key: string]: AuthPermissionDm }
  roles: { [key: string]: AuthRoleDm }
  rolePermissions: RolePermissionsDm
}
