import {Observable} from 'rxjs/Observable'
//noinspection TypeScriptPreferShortImport
import {AuthPermission} from '../../media-type/auth/auth-permission'

export abstract class PermissionService {
  abstract permissions$(): Observable<AuthPermission[]>

  abstract valuesOnce(): Promise<AuthPermission[]>

  abstract create(entity: AuthPermission): Promise<void>

  abstract value(entityKey: string): Promise<AuthPermission>

  abstract update(current: AuthPermission, previous: AuthPermission): Promise<void>

  abstract remove(entityKey: string): Promise<void>

  abstract destroy(): void
}
