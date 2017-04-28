import {ObjMap, OneToManyReferenceMap} from '@tangential/core'
//noinspection TypeScriptPreferShortImport
import {AuthPermissionJson} from '../media-type/auth/auth-permission'
import {AuthRole} from '../media-type/auth/auth-role'
import {AuthUserIF} from '../media-type/auth/auth-user'

export interface AuthorizationModel {
  permissions?: ObjMap<AuthPermissionJson>
  roles?: ObjMap<AuthRole>
  users?: ObjMap<AuthUserIF>
  role_permissions?: OneToManyReferenceMap
  user_granted_permissions?: OneToManyReferenceMap
  user_effective_permissions?: OneToManyReferenceMap
  user_roles?: OneToManyReferenceMap
}


