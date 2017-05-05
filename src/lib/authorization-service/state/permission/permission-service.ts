import {Observable} from 'rxjs/Observable'
//noinspection TypeScriptPreferShortImport
import {AuthPermission} from '../../media-type/cdm/auth-permission';

export abstract class PermissionService {
  abstract permissions$(): Observable<AuthPermission[]>

  abstract create(entity: AuthPermission): Promise<void>

  abstract value(entityKey: string): Promise<AuthPermission>

  abstract update(current: AuthPermission, previous: AuthPermission): Promise<void>

  abstract remove(entityKey: string): Promise<void>

  abstract destroy(): void
}
