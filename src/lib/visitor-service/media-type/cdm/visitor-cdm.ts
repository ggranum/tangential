import {AuthUser, SignInState, SignInStates} from '@tangential/authorization-service'
import {VisitorPreferencesCdm} from './visitor-preferences-cdm'
import {VisitorEventsCdm} from './visitor-events-cdm';


/**
 * The Visitor is the current session visitor. Current meaning 'whoever is clicking the buttons in the page right now'.
 * The visitor is registered in the AuthUser table (probably, unless they are a guest), but there can be only one
 * 'visitor' loaded and active in any given runtime at any one time. (Technically you can create as many as you want,
 * but you REALLY only want to have one active, or you're doing something bad and/or wrong.)
 *
 */
export class Visitor {

  authUser: AuthUser
  events: VisitorEventsCdm
  prefs: VisitorPreferencesCdm
  signInState: SignInState

  constructor(authUser: AuthUser, prefs: VisitorPreferencesCdm, signInState: SignInState) {
    this.authUser = authUser;
    this.prefs = prefs || new VisitorPreferencesCdm();
    this.signInState = signInState
  }

  public isPlaceholder(): boolean {
    return this.signInState === SignInStates.unknown
  }

  public isSignedIn(): boolean {
    return this.signInState === SignInStates.signedIn || this.isAnonymous() || this.isNewAccount()
  }

  public isNewAccount(): boolean {
    return this.signInState === SignInStates.newAccount
  }

  public isAnonymous(): boolean {
    return this.signInState === SignInStates.signedInAnonymous
  }

  public isGuest(): boolean {
    return this.isPlaceholder() || this.signInState === SignInStates.guest
  }

  public displayName() {
    return this.authUser ? this.authUser.displayName : 'Guest'
  }

  /* Convenience methods / hide the auth user when possible.  */

  /**
   *
   * @returns {boolean}
   */
  public isAdministrator(): boolean {
    return this.authUser && this.authUser.isAdministrator()
  }

  public hasRole(roleKey: string): boolean {
    return this.authUser && this.authUser.hasRole(roleKey)
  }

  public hasRoles(roleKeys: string[]) {
    roleKeys = roleKeys || []
    return roleKeys.every(key => this.hasRole(key))
  }

  public hasPermission(permissionKey: string): boolean {
    return this.authUser && this.authUser.hasPermission(permissionKey)
  }

  public hasPermissions(permissionKeys: string[]) {
    permissionKeys = permissionKeys || []
    return permissionKeys.every(key => this.hasPermission(key))
  }

}
