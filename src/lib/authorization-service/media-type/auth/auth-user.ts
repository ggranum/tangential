import {Jsonified, ObjectUtil, ObjMap} from '@tangential/core'
import {StampedMediaType, StampedMediaTypeJson} from '@tangential/media-types'
import {AuthPermission} from './auth-permission'
import {AuthRole} from './auth-role'

export interface SignInEvent {
  ipAddress: string
}

export interface AuthUserIF extends StampedMediaTypeJson {
  email?: string
  displayName?: string
  emailVerified?: boolean
  disabled?: boolean
  isAnonymous?: boolean
  lastSignInMils?: number
  lastSignInIp?: string
  photoURL?: string
  signInEvents?: ObjMap<SignInEvent>

}

const Model: AuthUserIF = {
  email:          null,
  displayName:    null,
  emailVerified:  false,
  disabled:       false,
  isAnonymous:    true,
  lastSignInMils: null,
  lastSignInIp:   null,
  photoURL:       null,
  signInEvents:   null,
}
/**
 * An AuthUser is not a Visitor!  Visitor refers to the person on the page _at the momemnt they are on the page_.
 * An AuthUser can be hydrated at anytime. For example, when using the admin console, 'user list' page will show
 * all the AuthUser's in your database. Some of those users might be logged in, but they aren't the current visitor,
 * relative to the current browser session.
 *
 */
export class AuthUser extends StampedMediaType implements Jsonified<AuthUser, AuthUserIF>, AuthUserIF {
  static $model: AuthUserIF = ObjectUtil.assignDeep({}, StampedMediaType.$model, Model)
  email?: string
  displayName?: string
  emailVerified?: boolean
  disabled?: boolean
  isAnonymous?: boolean
  lastSignInMils?: number
  lastSignInIp?: string
  photoURL?: string
  signInEvents?: ObjMap<SignInEvent>

  private $roles?: AuthRole[]
  private $effectivePermissions?: AuthPermission[]


  constructor(config: AuthUserIF, key?: string, roles?: AuthRole[], effectivePermissions?: AuthPermission[]) {
    super(config, key)
    if (!this.displayName) {
      this.displayName = this.isAnonymous ? 'Anonymous' : this.email.substr(0, this.email.indexOf('@'))
    }
    this.$roles = roles || []
    this.$effectivePermissions = effectivePermissions || []
  }

  addSignInEvent(ipAddresses: string[]) {
    ipAddresses = ipAddresses || ['unknown']
    this.signInEvents = this.signInEvents || {}
    const when = Date.now()
    this.signInEvents[when] = {ipAddress: ipAddresses.join(', ')}
  }


  public isAdministrator(): boolean {
    return this.hasRole('Administrator')
  }

  public hasRole(roleKey: string): boolean {
    return this.$roles.some(role => role.$key === roleKey)
  }

  public hasPermission(permissionKey: string): boolean {
    return this.$effectivePermissions.some(role => role.$key === permissionKey)
  }


  static guard(value: AuthUser | string): value is AuthUser {
    return !(typeof value === 'string') && (<AuthUser>value).$key !== undefined;
  }

}