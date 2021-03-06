import {
  AuthPermission,
  AuthPermissionDm
} from '@tangential/authorization-service'
import {Guard} from '@tangential/core'

export class InsufficientPermissions extends Error {

  name: string = InsufficientPermissions.name

  constructor(public permission: AuthPermission | string, message?: string) {
    super(message || `Insufficient Permissions: Requires permission '${Guard.isString(permission) ? permission : permission.$key}'`);
  }

}

