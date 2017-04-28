import {Injectable} from '@angular/core'

import {Logger, MessageBus, StunIpLookup} from '@tangential/core'
import {FirebaseProvider, FireBlanket} from '@tangential/firebase-util'
import * as firebase from 'firebase/app'
import {BehaviorSubject} from 'rxjs/BehaviorSubject'
import {Observable} from 'rxjs/Observable'
//noinspection TypeScriptPreferShortImport
import {AuthDocModel} from '../../media-type/auth/auth-doc-model'
//noinspection TypeScriptPreferShortImport
import {AuthPermission} from '../../media-type/auth/auth-permission'
import {AuthRole} from '../../media-type/auth/auth-role'
import {AuthUser, AuthUserIF} from '../../media-type/auth/auth-user'
//noinspection TypeScriptPreferShortImport
import {EmailPasswordCredentials} from '../../media-type/auth/email-password-credentials'
import {SignInState, SignInStates} from '../../sign-in-state'
import {UserService} from '../user/user-service'
import {AuthService} from './auth-service'
import EmailAuthProvider = firebase.auth.EmailAuthProvider

interface FirebaseAuthResponse {
  uid: string
  displayName: string
  email: string
  emailVerified: boolean
  isAnonymous: boolean
  photoURL: string
}


@Injectable()
export class FirebaseAuthService extends AuthService {


  private auth: firebase.auth.Auth
  private signInStateValue: SignInState
  private signInStateSubject: BehaviorSubject<SignInState>
  private authUserSubject: BehaviorSubject<AuthUser>

  constructor(private bus: MessageBus,
              private fb: FirebaseProvider,
              private userService: UserService) {
    super()
    this.auth = fb.app.auth()
    this.initSubjects()
    this.initSubscriptions()
    this.setSignInState(SignInStates.unknown)
  }

  private setCurrentUser(authUser: AuthUser) {
    if (authUser) {
      Logger.trace(this.bus, this, '#setCurrentUser', authUser.$key, authUser.email)
    } else {
      Logger.trace(this.bus, this, '#setCurrentUser', 'null user')
    }
    this.authUserSubject.next(authUser)
    if (authUser) {
      this.setSignInState(authUser.isAnonymous ? SignInStates.signedInAnonymous : SignInStates.signedIn)
    } else {
      this.setSignInState(SignInStates.signedOut)
    }
  }

  private initSubjects() {
    this.authUserSubject = new BehaviorSubject(null)
    this.signInStateSubject = new BehaviorSubject(SignInStates.unknown)
  }

  private initSubscriptions() {
    this.auth.onAuthStateChanged((fbAuthState: FirebaseAuthResponse) => {
      Logger.trace(this.bus, this, '#initSubscriptions', 'authStateChanged',
        fbAuthState, fbAuthState ? fbAuthState.uid + ':' + fbAuthState.email : '-')
      this.handleAuthStateChanged(fbAuthState)
    })
  }

  private handleAuthStateChanged(firebaseAuthResponse: FirebaseAuthResponse) {
    if (this.signInStateValue === SignInStates.signingUp) {
      Logger.trace(this.bus, this, '#handleAuthStateChanged', 'User is signing up, ignore state change')
    } else {
      if (firebaseAuthResponse && firebaseAuthResponse.uid) {
        Logger.trace(this.bus, this, '#handleAuthStateChanged', 'SignedIn', firebaseAuthResponse.uid, firebaseAuthResponse.email)
        this.handleUserSignedIn(firebaseAuthResponse.uid).then(authUser => {
          Logger.trace(this.bus, this, '#handleAuthStateChanged', 'User Resolved', firebaseAuthResponse.uid, firebaseAuthResponse.email)
          this.setCurrentUser(authUser)
        })
      } else if (firebaseAuthResponse) {
        // @revisit: Verify with firebase docs re: how this state should be handled
        throw new Error('Unexpected state.')
      } else {
        Logger.trace(this.bus, this, '#handleAuthStateChanged', 'Guest/Signed Out')
        this.setSignInState(SignInStates.guest)
        this.setCurrentUser(null)
      }
    }
  }

  private handleUserSignedIn(userKey: string): Promise<AuthUser> {
    return this.userService.value(userKey).then((authUser) => {
      let roles: AuthRole[]
      let effectivePermissions: AuthPermission[]
      return Promise.all([
        this.userService.getRolesForUser(authUser).then(r => roles = r),
        this.userService.getEffectivePermissionsForUser(authUser).then(ep => effectivePermissions = ep),
      ]).then(() => {
        this.updateUserAuthData(authUser)
        return new AuthUser(authUser, authUser.$key, roles, effectivePermissions)
      })
    })
  }

  private setSignInState(newState: SignInState) {
    if (this.signInStateValue !== newState) {
      this.signInStateValue = newState
      this.signInStateSubject.next(this.signInStateValue)
    }
  }

  signInState$(): Observable<SignInState> {
    return this.signInStateSubject
  }

  authUser$(): Observable<AuthUser> {
    return this.authUserSubject
  }

  /**
   * Auth state changes - including which user is set as currentAuthUser - are handled by listening for
   * changes sent down by firebase, NOT by manually setting the currentUser here. We have to set the login state
   * here because that information can't be derived from what is supplied by firebase.
   *
   * There's some excellent arguments for dropping the sign-in-state tracking.
   *
   * @param payload
   * @param suppressUserInfoSynchronization
   * @returns {Promise<T>}
   */
  signInWithEmailAndPassword(payload: EmailPasswordCredentials, suppressUserInfoSynchronization: boolean = false): Promise<AuthUser> {
    Logger.trace(this.bus, this, '#signInWithEmailAndPassword', 'enter', payload.email)
    this.setSignInState(SignInStates.signingIn)
    const loginCfg = {
      email:    payload.email,
      password: payload.password
    }
    return new Promise((resolve, reject) => {
      let readyToResolve = true
      this.authUserSubject.skip(1).subscribe(v => {
        if (readyToResolve) {
          Logger.trace(this.bus, this, '#signInWithEmailAndPassword', 'signed in, resolving', payload.email)
          resolve(v)
        }
      })
      this.auth.signInWithEmailAndPassword(loginCfg.email, loginCfg.password)
        .then((fbAuthState) => {
          readyToResolve = true
          const authUser = new AuthUser(this.userFromFirebaseResponse(fbAuthState));
          if (suppressUserInfoSynchronization !== true) {
            this.syncExistingAuthUserOnSignIn(authUser)
          }
        }).catch((reason) => {
        this.setSignInState(SignInStates.signInFailed)
        reject(reason)
      })
    });
  }

  /**
   * Synchronize auth data between firebase auth and local user table.
   * Check that the user already exists locally - create if not.
   * Update the user's last-login time.
   * @param firebaseAuthData
   * @returns {Promise<AuthUser>}
   */
  private syncExistingAuthUserOnSignIn(firebaseAuthData: AuthUser): Promise<AuthUser> {
    Logger.trace(this.bus, this, '#syncExistingAuthUserOnSignIn', firebaseAuthData.email)
    return this.userService.value(firebaseAuthData.$key).then((localAuthUser: AuthUser): Promise<AuthUser> => {
      if (!localAuthUser) {
        // the user was created but some other way, or something got out of sync; re-create their entry
        // in the database.
        return this.userService.create(firebaseAuthData).then(() => {
          return firebaseAuthData
        }).catch((reason) => {
          Logger.error(this.bus, this, 'Error synchronizing user data from firebase auth to local user table', reason)
        })
      } else {
        return Promise.resolve(localAuthUser)
      }
    })
  }

  private updateUserAuthData(localAuthUser: AuthUser) {
    Logger.trace(this.bus, this, '#updateUserAuthData', localAuthUser.email)
    localAuthUser.lastSignInMils = Date.now()
    StunIpLookup.getIPs(5000, false).then(results => {
      Logger.trace(this.bus, this, '#updateUserAuthData', 'updating last sign in ip: ', results, localAuthUser.email)
      localAuthUser.addSignInEvent(results ? results : ['unknown'])
      this.userService.update(localAuthUser).catch(e => {
        Logger.error(this.bus, this, '#updateUserAuthData', 'Could not update user data for user: ', localAuthUser.email, e)
      })
    })
  }

  signInAnonymously(): Promise<AuthUser> {
    Logger.trace(this.bus, this, '#signInAnonymously')

    this.setSignInState(SignInStates.signingIn)
    return new Promise((resolve, reject) => {
      this.auth.signInAnonymously()
        .then((fbAuthState) => {
          const authUser = new AuthUser(this.userFromFirebaseResponse(fbAuthState))
          return this.userService.create(authUser).then(() => {
            Logger.trace(this.bus, this, 'created anonymous user')
            this.setSignInState(SignInStates.signedInAnonymous)
            resolve(authUser)
          })
        })
        .catch((reason) => {
          this.setSignInState(SignInStates.signInFailed)
          reject(reason)
        })
    });
  }

  createUserWithEmailAndPassword(payload: EmailPasswordCredentials): Promise<AuthUser> {
    this.setSignInState(SignInStates.signingUp)
    return new Promise((resolve, reject) => {
      this.auth.createUserWithEmailAndPassword(payload.email, payload.password)
        .then((fbAuthState) => {
          const authUser = new AuthUser(this.userFromFirebaseResponse(fbAuthState));
          return this.userService.create(authUser).then(() => {
            Logger.trace(this.bus, this, 'created user', authUser.email)
            this.handleUserSignedIn(authUser.$key).then(hydratedUser => {
              this.setCurrentUser(hydratedUser)
              resolve(hydratedUser)
            })
          })
        })
        .catch((reason) => {
          this.setSignInState(SignInStates.signUpFailed)
          reject(reason)
        })
    })
  }

  signOut(): Promise<void> {
    this.setSignInState(SignInStates.signingOut)
    return new Promise<void>((resolve, reject) => {
      this.auth.signOut().then(() => {
        this.setSignInState(SignInStates.signedOut)
        resolve()
      }).catch(() => {
        this.setSignInState(this.auth.currentUser ? SignInStates.signedIn : SignInStates.signedOut)
        reject()
      })
    })
  }


  deleteAccount(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const _authUser = this.auth.currentUser
      if (_authUser) {
        this.userService.remove(_authUser.uid).then(() => {
          this.auth.currentUser.delete().then(resolve)
        }).catch((reason) => reject(reason))
      } else {
        reject('NOT_SIGNED_IN')
      }
    })
  }

  public sendResetPasswordEmail(emailAddress: string): Promise<void> {
    return <Promise<void>>this.fb.app.auth().sendPasswordResetEmail(emailAddress)
  }


  public linkAnonymousAccount(authUser: AuthUser, payload: EmailPasswordCredentials): Promise<AuthUser> {
    this.setSignInState(SignInStates.signingUp)
    const credential = EmailAuthProvider.credential(payload.email, payload.password);
    return <Promise<AuthUser>>this.fb.app.auth().currentUser.link(credential)
      .then((fbAuthState) => {
        Logger.trace(this.bus, this, '#linkAnonymousAccount', 'linked user', fbAuthState.uid, fbAuthState.email)
        const newAuthUser = new AuthUser(this.userFromFirebaseResponse(fbAuthState));
        return this.userService.update(newAuthUser).then(() => {
          Logger.trace(this.bus, this, '#linkAnonymousAccount', 'updated linked user data', newAuthUser.email)
          return this.handleUserSignedIn(newAuthUser.$key).then(hydratedUser => {
            this.setCurrentUser(hydratedUser)
          })
        })
      })
      .catch((reason) => {
        this.setSignInState(SignInStates.signUpFailed)
        throw reason
      })
  }


  public authDocumentModel$(): Observable<AuthDocModel> {
    const ref = this.fb.app.database().ref('/auth')
    return FireBlanket.awaitValue$(ref).map(snap => new AuthDocModel(snap.val()))
  }


  private userFromFirebaseResponse(fbResponse: FirebaseAuthResponse): AuthUserIF {
    const user: AuthUserIF = {}
    user.$key = fbResponse.uid
    user.displayName = fbResponse.displayName
    user.email = fbResponse.email
    user.emailVerified = fbResponse.emailVerified
    user.isAnonymous = fbResponse.isAnonymous
    user.photoURL = fbResponse.photoURL
    return user;
  }


}
