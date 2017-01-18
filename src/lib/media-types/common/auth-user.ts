import {MediaType, TypeDescriptor} from "../media-type";
import {ObjectUtil, ToJson, Keyed} from "@tangential/common";

export const __AuthUser: TypeDescriptor = {
  name: 'auth-user',
  version: 1,
  prefix: 'vnd'
}

export class AuthUserType implements MediaType {
  descriptor: TypeDescriptor = __AuthUser;
  definition: typeof AuthUser = AuthUser
}

export interface AuthUserIF {
  $key?: string
  lastSignInMils?: number
  createdMils?: number
  lastSignInIp?: string
  displayName?: string
  email?: string
  photoURL?: string
  emailVerified?: boolean
  disabled?: boolean
  isAnonymous?: boolean
}

export class AuthUser implements AuthUserIF, Keyed, ToJson {
  $key?: string
  createdMils?: number
  email?: string
  displayName?: string
  emailVerified?: boolean
  disabled?: boolean
  isAnonymous?: boolean
  lastSignInMils?: number
  lastSignInIp?: string
  photoURL?: string

  constructor(config: AuthUserIF) {
    config = config || {}

    this.$key = config.$key || config['uid']
    this.lastSignInMils = config.lastSignInMils
    this.createdMils = config.createdMils || Date.now()
    this.lastSignInIp = config.lastSignInIp
    this.displayName = config.displayName
    this.email = config.email
    this.photoURL = config.photoURL
    this.emailVerified = config.emailVerified
    this.disabled = config.disabled
    this.isAnonymous = config.isAnonymous

    if(!this.displayName ){
      this.displayName = this.isAnonymous ? 'Anonymous' : this.email.substr(0, this.email.indexOf('@'))
    }
  }

  /**
   * @returns {AuthUser}
   * @pure
   */
  clone() {
    return new AuthUser(this)
  }

  toJson(includeHidden?:boolean):AuthUserIF {
    let json:AuthUserIF = {
      lastSignInMils: this.lastSignInMils,
      createdMils: this.createdMils,
      lastSignInIp: this.lastSignInIp,
      displayName: this.displayName,
      email: this.email,
      photoURL: this.photoURL,
      emailVerified: this.emailVerified,
      disabled: this.disabled,
      isAnonymous: this.isAnonymous,
    }
    if(includeHidden === true){
      json.$key = this.$key
    }
    return ObjectUtil.removeNullish(json)
  }




}
