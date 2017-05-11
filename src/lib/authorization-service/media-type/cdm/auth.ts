import {ObjectUtil, ObjMap} from '@tangential/core';
import {AuthDm} from '../doc-model/auth';
import {AuthPermission, AuthPermissionTransform} from './auth-permission';
import {AuthRoleTransform} from './auth-role';
import {AuthUser, AuthUserTransform} from './auth-user';
import {AuthSettingsDm} from '../doc-model/auth-settings';
import {AuthSettings} from './auth-settings';
import {AuthSettingsTransform} from './auth-settings';


export class Auth {

  constructor(public settings: AuthSettings,
              public users?: AuthUser[]) {
  }
}

export class AuthTransform {

  static fromDocModel(docModel: AuthDm): Auth {
    const settings = AuthSettingsTransform.fromDocModel(docModel.settings)
    const users = AuthUserTransform.fromDocModels(
      docModel.users,
      docModel.ep,
      docModel.grantedPermissions,
      docModel.grantedRoles, settings)
    return new Auth(settings, users)
  }


}
