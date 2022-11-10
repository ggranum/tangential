import {AuthDm} from '../doc-model/auth';
import {AuthSettings, AuthSettingsTransform} from './auth-settings';
import {AuthUser, AuthUserTransform} from './auth-user';


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
