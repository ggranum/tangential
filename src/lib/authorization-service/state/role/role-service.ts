import {Observable} from 'rxjs/Observable'
//noinspection TypeScriptPreferShortImport
import {AuthRole} from '../../media-type/cdm/auth-role';
//noinspection TypeScriptPreferShortImport
import {AuthPermission} from '../../media-type/cdm/auth-permission';
import {AuthRoleKey} from '../../media-type/doc-model/auth-role';
//noinspection TypeScriptPreferShortImport
import {AuthPermissionKey} from '../../media-type/doc-model/auth-permission';

export abstract class RoleService {

  abstract roles$(): Observable<AuthRole[]>

  abstract valuesOnce(): Promise<AuthRole[]>

  abstract create(entity: AuthRole): Promise<void>

  abstract value(roleKey: AuthRoleKey): Promise<AuthRole>

  abstract update(current: AuthRole, previous: AuthRole): Promise<void>

  abstract remove(roleKey: AuthRoleKey): Promise<void>

  abstract destroy(): void

  abstract grantPermission(roleKey: AuthRoleKey, permissionKey: AuthPermissionKey): Promise<void>

  abstract revokePermission(roleKey: AuthRoleKey, permissionKey: AuthPermissionKey): Promise<void>

  abstract getPermissionsForRole(roleKey: AuthRoleKey): Promise<AuthPermission[]>

  abstract getPermissionsForRole$(roleKey: AuthRoleKey): Observable<AuthPermission[]>
}
