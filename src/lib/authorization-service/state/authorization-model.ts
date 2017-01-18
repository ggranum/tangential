import {ObjMap, OneToManyReferenceMap} from "@tangential/common";
import {AuthUserIF, AuthPermissionIF, AuthRole} from "@tangential/media-types";

export interface AuthorizationModel {
  permissions?: ObjMap<AuthPermissionIF>
  roles?: ObjMap<AuthRole>
  users?: ObjMap<AuthUserIF>
  role_permissions?: OneToManyReferenceMap
  user_granted_permissions?: OneToManyReferenceMap
  user_effective_permissions?: OneToManyReferenceMap
  user_roles?: OneToManyReferenceMap
}


