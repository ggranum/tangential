import {Observable} from "rxjs";
import {TgServiceIF, OneToManyReferenceMap} from "@tangential/common";
import {AuthRole, AuthPermission} from "@tangential/media-types";

export abstract class RoleService implements  TgServiceIF<AuthRole> {

  abstract values(): Observable<AuthRole[]>
  abstract valuesOnce(): Promise<AuthRole[]>
  abstract setEntities(entities: AuthRole[]): Promise<void>
  abstract create(entity: AuthRole): Promise<AuthRole>
  abstract value(entityKey: string): Promise<AuthRole>
  abstract update(current: AuthRole, previous: AuthRole): Promise<AuthRole>
  abstract remove(entityKey: string): Promise<void>
  abstract destroy(): void

  abstract setRolePermissions(rolePermissions: OneToManyReferenceMap): Promise<void>
  abstract grantPermission(role: AuthRole, permission: any): Promise<{role: AuthRole, permission: AuthPermission}>
  abstract revokePermission(role: AuthRole, permission: any): Promise<{role: AuthRole, permission: AuthPermission}>
  abstract getPermissionsForRole$(role: AuthRole): Observable<AuthPermission[]>
}
