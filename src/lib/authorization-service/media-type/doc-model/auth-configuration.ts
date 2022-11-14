import {Database, DatabaseReference} from '@firebase/database'
import {child} from 'firebase/database'

import {AuthPermissionKey} from './auth-permission';
import {AuthSettingsFirebaseRef} from './auth-settings';


export const AuthConfigurationFirebaseRef = function(db: Database):DatabaseReference {
  return child(AuthSettingsFirebaseRef(db), 'configuration')
}


export interface AuthConfigurationDm {
  defaultAnonymousRole: AuthPermissionKey,
  defaultUserRole: AuthPermissionKey
}
