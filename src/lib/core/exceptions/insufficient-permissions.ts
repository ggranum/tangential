import {AuthPermission,} from '@tangential/authorization-service'
// noinspection ES6PreferShortImport
import {Guard} from '../lang/guard/guard'

export class InsufficientPermissions extends Error {

  override name: string = 'InsufficientPermissions'

  constructor(public permission: AuthPermission | string, message?: string) {
    super(message || `Insufficient Permissions: Requires permission '${Guard.isString(permission) ? permission : permission.$key}'`);
  }

}

