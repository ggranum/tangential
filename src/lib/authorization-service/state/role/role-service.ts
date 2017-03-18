import {Observable} from "rxjs";
import {TgServiceIF, OneToManyReferenceMap} from "@tangential/common";
import {AuthRole, AuthPermission} from "@tangential/media-types";

export abstract class RoleService {

  abstract values(): Observable<AuthRole[]>
  abstract valuesOnce(): Promise<AuthRole[]>
  abstract create(entity: AuthRole): Promise<AuthRole>
  abstract value(entityKey: string): Promise<AuthRole>
  abstract update(current: AuthRole, previous: AuthRole): Promise<AuthRole>
  abstract remove(entityKey: string): Promise<string>
  abstract destroy(): void

  abstract grantPermission(role: AuthRole | string, permission: AuthPermission | string): Promise<void>
  abstract revokePermission(role: AuthRole | string, permission: AuthPermission | string): Promise<void>
  abstract getPermissionsForRole(role: AuthRole): Promise<AuthPermission[]>
  abstract getPermissionsForRole$(role: AuthRole): Observable<AuthPermission[]>
}
