import {ObjMap, OneToManyReferenceMap} from '@tangential/core'
import {Observable} from 'rxjs/Observable'
//noinspection TypeScriptPreferShortImport
import {AuthPermission} from '../../media-type/auth/auth-permission'
import {AuthRole} from '../../media-type/auth/auth-role'
import {AuthUser} from '../../media-type/auth/auth-user'

export abstract class UserService {
  abstract values(): Observable<AuthUser[]>

  abstract valuesOnce(): Promise<AuthUser[]>

  abstract create(entity: AuthUser): Promise<void>

  abstract value(entityKey: string): Promise<AuthUser>

  abstract update(current: AuthUser, previous?: AuthUser): Promise<void>

  abstract remove(entityKey: string): Promise<void>

  abstract destroy(): void

  abstract grantPermission(user: AuthUser, permission: any): Promise<void>

  abstract revokePermission(user: AuthUser, permission: any): Promise<void>

  abstract grantRole(user: AuthUser, role: any): Promise<void>

  abstract revokeRole(user: AuthUser, role: any): Promise<void>

  abstract getRolesForUser(user: AuthUser): Promise<AuthRole[]>

  abstract getRolePermissionsForUser(user: AuthUser | string): Promise<ObjMap<AuthPermission>>

  abstract getGrantedPermissionsForUser(user: AuthUser | string): Promise<AuthPermission[]>

  abstract getEffectivePermissionsForUser(user: AuthUser | string): Promise<AuthPermission[]>

  abstract getUserRoles(): Promise<OneToManyReferenceMap>

  abstract removeUserRoles(...forUserKeys: string[]): Promise<void>
}


