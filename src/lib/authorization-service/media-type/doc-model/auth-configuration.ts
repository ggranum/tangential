import {AuthPermissionKey} from './auth-permission';
import {AuthSettingsFirebaseRef} from './auth-settings';


export const AuthConfigurationFirebaseRef = function(db: firebase.database.Database):firebase.database.Reference {
  return AuthSettingsFirebaseRef(db).child('configuration')
}


export interface AuthConfigurationDm {
  defaultAnonymousRole: AuthPermissionKey,
  defaultUserRole: AuthPermissionKey
}
