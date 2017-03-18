import {Jsonified, ObjectUtil} from "@tangential/common";
import {StampedMediaType, StampedMediaTypeJson} from "@tangential/media-types";


export interface AuthUserIF extends StampedMediaTypeJson {
  email?: string
  displayName?: string
  emailVerified?: boolean
  disabled?: boolean
  isAnonymous?: boolean
  lastSignInMils?: number
  lastSignInIp?: string
  photoURL?: string
}

const Model: AuthUserIF = {
  email: null,
  displayName: null,
  emailVerified: false,
  disabled: false,
  isAnonymous: true,
  lastSignInMils: null,
  lastSignInIp: null,
  photoURL: null,
}

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

  constructor(config: AuthUserIF, key?: string) {
    super(config, key)
    if (!this.displayName) {
      this.displayName = this.isAnonymous ? 'Anonymous' : this.email.substr(0, this.email.indexOf('@'))
    }
  }

  static guard(value: AuthUser | string ): value is AuthUser {
    return !(typeof value == 'string') && (<AuthUser>value).$key !== undefined;
  }

}
