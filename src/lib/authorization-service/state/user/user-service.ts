import {ObjMap} from '@tangential/core';
import {Observable} from 'rxjs/Observable';
//noinspection TypeScriptPreferShortImport
import {AuthRoleKey} from '../../media-type/doc-model/auth-role';
import {AuthUserDm, AuthUserKey} from '../../media-type/doc-model/auth-user';
//noinspection TypeScriptPreferShortImport
import {AuthPermission} from '../../media-type/cdm/auth-permission';
import {AuthRole} from '../../media-type/cdm/auth-role';
import {AuthUser} from '../../media-type/cdm/auth-user';

export abstract class UserService {

  abstract awaitUsers$(): Observable<AuthUserDm[]>

  abstract create(entity: AuthUser): Promise<void>

  abstract getUserFragment(key: AuthUserKey): Promise<AuthUser>

  abstract getUser(key: AuthUserKey): Promise<AuthUser>

  abstract update(current: AuthUser): Promise<void>

  abstract remove(entityKey: string): Promise<void>

  abstract destroy(): void

  abstract grantPermission(user: AuthUserDm, permission: any): Promise<void>

  abstract revokePermission(user: AuthUserDm, permission: any): Promise<void>

  abstract grantRole(user: AuthUserDm, role: any): Promise<void>

  abstract revokeRole(userKey: AuthUserKey, roleKey: AuthRoleKey): Promise<void>

  abstract effectivePermissionsFor(userKey: AuthUserKey): Promise<ObjMap<AuthPermission>>

  abstract grantedPermissionsFor(userKey: AuthUserKey): Promise<ObjMap<AuthPermission>>

  abstract grantedRolesFor(userKey: AuthUserKey): Promise<ObjMap<AuthRole>>

  abstract removeUserRoles(...forUserKeys: string[]): Promise<void>
}


