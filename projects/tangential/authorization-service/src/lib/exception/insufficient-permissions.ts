import {AuthPermission,} from '../index'
import {Guard} from '@tangential/core'

export class InsufficientPermissions extends Error {

  override name: string = 'InsufficientPermissions'

  constructor(public permission: AuthPermission | string, message?: string) {
    super(message || `Insufficient Permissions: Requires permission '${Guard.isString(permission) ? permission : permission.$key}'`);
  }

}

