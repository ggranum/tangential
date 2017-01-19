import {AuthUser, AuthPermission, AuthRole} from "@tangential/media-types";
import {Observable} from "rxjs";
import {TgServiceIF, OneToManyReferenceMap} from "@tangential/common";

export abstract class UserService implements TgServiceIF<AuthUser> {
  abstract values(): Observable<AuthUser[]>
  abstract valuesOnce(): Promise<AuthUser[]>
  abstract setEntities(entities: AuthUser[]): Promise<void>
  abstract create(entity: AuthUser): Promise<AuthUser>
  abstract value(entityKey: string): Promise<AuthUser>
  abstract update(current: AuthUser, previous?: AuthUser): Promise<AuthUser>
  abstract remove(entityKey: string): Promise<string>
  abstract destroy(): void

  abstract setUserRolesAndPermissions(userPermissions: OneToManyReferenceMap,
                                      userRoles: OneToManyReferenceMap,
                                      rolePermissions: OneToManyReferenceMap ): Promise<void>
  abstract grantPermission(user: AuthUser, permission: any): Promise<{user: AuthUser, permission: AuthPermission}>
  abstract revokePermission(user: AuthUser, permission: any): Promise<{user: AuthUser, permission: AuthPermission}>
  abstract getPermissionsForUser(user: AuthUser): Observable<AuthPermission[]>

  abstract grantRole(user: AuthUser, role: any): Promise<{user: AuthUser, role: AuthRole}>
  abstract revokeRole(user: AuthUser, role: any): Promise<{user: AuthUser, role: AuthRole}>
  abstract getRolesForUser$(user: AuthUser): Observable<AuthRole[]>
  abstract getGrantedPermissionsForUser$(user: AuthUser): Observable<AuthPermission[]>
  abstract getEffectivePermissionsForUser$(user: AuthUser): Observable<AuthPermission[]>
  abstract getUserRoles(): Promise<OneToManyReferenceMap>
  abstract removeUserRoles(...forUserKeys:string[]): Promise<string[]>
}


