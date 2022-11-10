import {AuthPermission,} from '@tangential/authorization-service'
// noinspection TypeScriptPreferShortImport
import {Guard} from '../lang/guard/guard'

export class InsufficientPermissions extends Error {

  name: string = 'InsufficientPermissions'

  constructor(public permission: AuthPermission | string, message?: string) {
    super(message || `Insufficient Permissions: Requires permission '${Guard.isString(permission) ? permission : permission.$key}'`);
  }

}

