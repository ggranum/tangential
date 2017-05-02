import {AuthUser, SignInState, SignInStates} from '@tangential/authorization-service'
import {VisitorPreferences} from './visitor-preferences'


interface VisitorIF {

  authUser: AuthUser
  prefs: VisitorPreferences

  /**
   * The visitor has not signed in, even anonymously, or the state is still unknown.
   */
  isGuest(): boolean

  /**
   * If the visitor is known and is signed in. Could be automatic ('remember me') or manual.
   * Anonymous users *are* signed in.
   */
  isSignedIn(): boolean

  /**
   * If the visitor is signed in anonymously. The visitor's session can be linked to a 'real' account
   * if they register before their cookie dies or is lost.
   */
  isAnonymous(): boolean

  /**
   * If the user registered during this session. A single full page load/refresh will of course kill off this state,
   * so if new account status is important you'll want to create a method that refers to the createdMils stamp on the
   * authUser data.
   */
  isNewAccount(): boolean

  /**
   * Convenience methods that forward to the authUser instance, to help avoid exposing authUser within the context
   * of the 'current visitor actions'. Probably silly. Oh well.
   */
  isAdministrator(): boolean
  hasRole(roleKey: string): boolean
  hasPermission(permissionKey: string): boolean
}

/**
 * The Visitor is the current session visitor. Current meaning 'whoever is clicking the buttons in the page right now'.
 * The visitor is registered in the AuthUser table (probably, unless they are a guest), but there can be only one
 * 'visitor' loaded and active in any given runtime at any one time. (Technically you can create as many as you want,
 * but you REALLY only want to have one active, or you're doing something bad and/or wrong.)
 *
 */
export class Visitor implements VisitorIF {


  authUser: AuthUser
  prefs: VisitorPreferences

  public signInState: SignInState


  constructor(authUser: AuthUser, prefs: VisitorPreferences, signInState: SignInState) {
    this.authUser = authUser;
    this.prefs = prefs || new VisitorPreferences();
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
    console.log("SignInState: ", this.signInState)
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
