import {Observable} from 'rxjs/Observable'
//noinspection TypeScriptPreferShortImport
import {AuthPermission} from '../../media-type/auth/auth-permission'
import {AuthRole} from '../../media-type/auth/auth-role'

export abstract class RoleService {

  abstract roles$(): Observable<AuthRole[]>

  abstract valuesOnce(): Promise<AuthRole[]>

  abstract create(entity: AuthRole): Promise<void>

  abstract value(entityKey: string): Promise<AuthRole>

  abstract update(current: AuthRole, previous: AuthRole): Promise<void>

  abstract remove(entityKey: string): Promise<void>

  abstract destroy(): void

  abstract grantPermission(role: AuthRole | string, permission: AuthPermission | string): Promise<void>

  abstract revokePermission(role: AuthRole | string, permission: AuthPermission | string): Promise<void>

  abstract getPermissionsForRole(role: AuthRole): Promise<AuthPermission[]>

  abstract getPermissionsForRole$(role: AuthRole): Observable<AuthPermission[]>
}
