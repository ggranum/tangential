import {SignInState, SignInStates} from '../../sign-in-state';
import {SessionInfoCdm} from './session-info';
import {AuthUser, AuthUserCfg} from './auth-user';
import {AuthUserKey} from '../doc-model/auth-user';
import {generatePushID} from '@tangential/core';

export const AnonymousSubjectUserKey = 'Anonymous'

export interface AuthSubjectCfg extends AuthUserCfg {
  signInState?: SignInState
  sessionInfo?: SessionInfoCdm;
}

/**
 * Conceptual Data Model for an Authentication Subject.
 *
 */
export class AuthSubject extends AuthUser {
  static UnknownSubject = new AuthSubject(AnonymousSubjectUserKey)
  static GuestSubject = new AuthSubject(AnonymousSubjectUserKey, SignInStates.guest)

  signInState: SignInState
  sessionInfo: SessionInfoCdm;

  constructor(key?: AuthUserKey, signInState?: SignInState) {
    super(key)
    this.signInState = signInState || SignInStates.unknown
    this.displayName = 'Guest'
  }

  public isSignedIn(): boolean {
    return this.signInState === SignInStates.signedIn || this.isAnonymous || this.isNewAccount()
  }

  public isNewAccount(): boolean {
    return this.signInState === SignInStates.newAccount
  }

  /**
   * If the user has not signed in in any way. Not to be confused with isUnknown, which means that our IAM server (Firebase) has
   * not yet informed us if the Subject is remembered or not.
   * @returns {boolean}
   */
  public isGuest(): boolean {
    return this.signInState === SignInStates.guest
  }

  public isUnknown(): boolean {
    return this.signInState === SignInStates.unknown
  }



  static copyTo(source: AuthSubject | AuthSubjectCfg, target: AuthSubject | AuthSubjectCfg) {
    AuthUser.copyTo(source, target)
    target.signInState = source.signInState
    target.sessionInfo = source.sessionInfo
  }

  static from(cfg: AuthSubject | AuthSubjectCfg): AuthSubject {
    let subject = new AuthSubject(cfg.$key || generatePushID())
    subject.signInState = cfg.signInState
    subject.sessionInfo = cfg.sessionInfo
    return subject
  }


}


export class AuthSubjectTransform {
  static from(user: AuthUser, signInState: SignInState, sessionInfo: SessionInfoCdm): AuthSubject {
    const subject = new AuthSubject(user.$key)
    subject.signInState = signInState
    subject.sessionInfo = sessionInfo
    AuthUser.copyTo(user, subject)
    return subject
  }
}
