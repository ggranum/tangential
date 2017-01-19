import {Injectable, EventEmitter} from '@angular/core'
import {Observable, Subscriber} from 'rxjs'
import {EmailPasswordCredentials, AuthUser, AuthUserIF, AuthRole, AuthPermission} from "@tangential/media-types";
import {FirebaseProvider} from "@tangential/firebase";
//noinspection TypeScriptPreferShortImport
import {VisitorService} from "./visitor-service";
import {UserService} from "../user/user-service";
import {SignInState} from "../../sign-in-state";

@Injectable()
export class FirebaseVisitorService implements VisitorService {

  private _auth: firebase.auth.Auth
  private _signInStateValue: SignInState
  private _signInState$: EventEmitter<SignInState>
  private _currentVisitor: AuthUser

  constructor(public fb: FirebaseProvider, private _userService: UserService) {
    this._auth = fb.app.auth()
    this._signInState$ = new EventEmitter<SignInState>(false)
    this._setSignInState(SignInState.unknown)
  }

  _setSignInState(newState: SignInState) {
    console.log('FirebaseVisitorService', '_setSignInState', newState)
    if (this._signInStateValue !== newState) {
      this._signInStateValue = newState
      console.log('FirebaseVisitorService', '_setSignInState2', this._signInStateValue)

      this._signInState$.emit(this._signInStateValue)
    }
  }

  signInWithEmailAndPassword(payload: EmailPasswordCredentials, suppressUserInfoSynchronization: boolean = false): Promise<AuthUser> {
    this._setSignInState(SignInState.signingIn)
    let loginCfg = {
      email: payload.email,
      password: payload.password
    }
    return new Promise((resolve, reject) => {
      this._auth.signInWithEmailAndPassword(loginCfg.email, loginCfg.password)
        .then((fbAuthState) => {
          const authUser = new AuthUser(this.userFromFirebaseResponse(fbAuthState));
          return this._userService.value(authUser.$key).then((visitor: AuthUser) => {
            if (suppressUserInfoSynchronization !== false) {
              resolve(visitor)
            } else {
              if (!visitor) {
                // the user was created but some other way, or something got out of sync; re-create their entry
                // in the database.
                this._userService.create(authUser).then(() => {
                  this._setSignInState(SignInState.signedIn)
                  resolve(authUser)
                }).catch((reason)=>{
                  reject(reason)
                })
              } else {
                this._setSignInState(SignInState.signedIn)
                resolve(visitor)
              }
            }
          }).catch((reason) =>{
            reject(reason)
          })
        }).catch((reason) => {
          this._setSignInState(SignInState.signInFailed)
          reject(reason)
        })
    });
  }

  signInAnonymously(): Promise<AuthUser> {
    this._setSignInState(SignInState.signingIn)
    return new Promise((resolve, reject) => {
      this._auth.signInAnonymously()
        .then((fbAuthState) => {
          this._setSignInState(SignInState.signedInAnonymous)
          resolve(new AuthUser(this.userFromFirebaseResponse(fbAuthState)))
        })
        .catch((reason) => {
          this._setSignInState(SignInState.signInFailed)
          reject(reason)
        })
    });
  }

  createUserWithEmailAndPassword(payload: EmailPasswordCredentials): Promise<AuthUser> {
    this._setSignInState(SignInState.signingUp)
    return new Promise((resolve, reject) => {
      this._auth.createUserWithEmailAndPassword(payload.email, payload.password)
        .then((fbAuthState) => {
          const authUser = new AuthUser(this.userFromFirebaseResponse(fbAuthState));
          return this._userService.create(authUser).then(() => {
            this._setSignInState(SignInState.signedIn)
            resolve(authUser)
          })
        })
        .catch((reason) => {
          this._setSignInState(SignInState.signUpFailed)
          reject(reason)
        })
    })
  }

  loadVisitorPermissions(visitor: AuthUser): Observable<AuthUser> {
    return Observable.of(visitor)
  }

  signOut(): Promise<void> {
    this._setSignInState(SignInState.signingOut)
    return new Promise<void>((resolve, reject) => {
      this._auth.signOut().then(() => {
        this._setSignInState(SignInState.signedOut)
        resolve()
      }).catch(() => {
        this._setSignInState(this._auth.currentUser ? SignInState.signedIn : SignInState.signedOut)
        reject()
      })
    })
  }

  signOnObserver(): Observable<AuthUser> {
    return Observable.create((subscriber:Subscriber<any>) => {
      this._auth.onAuthStateChanged((event:any) => {
        subscriber.next(event)
      })
    }).map((fbAuthState:any) => {
      let visitor: AuthUser = null
      if (fbAuthState) {
        visitor = new AuthUser(this.userFromFirebaseResponse(fbAuthState))
        this._setSignInState(visitor.isAnonymous ? SignInState.signedInAnonymous : SignInState.signedIn)
      }
      else {
        this._setSignInState(SignInState.signedOut)
      }
      this._currentVisitor = visitor
      return visitor
    })
  }

  deleteAccount(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      let _authUser = this._auth.currentUser
      if (_authUser) {
        this._userService.remove(_authUser.uid).then(() => {
          this._auth.currentUser.delete().then(resolve)
        }).catch((reason) => reject(reason))
      }
      else {
        reject("NOT_SIGNED_IN")
      }
    })
  }

  signInState$(): Observable<SignInState> {
    return this._signInState$
  }

  signInState(): SignInState {
    return this._signInStateValue
  }


  getEffectivePermissions$():Observable<AuthPermission[]> {
    return this._userService.getEffectivePermissionsForUser$(this._currentVisitor).do((perms)=>{
      console.log('FirebaseVisitorService', 'Received effective permissions')
    })
  }

  getGrantedPermissions$():Observable<AuthPermission[]> {
    return this._userService.getGrantedPermissionsForUser$(this._currentVisitor)
  }

  getRoles$():Observable<AuthRole[]> {
    return this._userService.getRolesForUser$(this._currentVisitor)
  }

  private userFromFirebaseResponse(fbResponse: any): AuthUserIF {
    let user: AuthUserIF = {}
    user.$key = fbResponse.uid
    user.displayName = fbResponse.displayName
    user.email = fbResponse.email
    user.emailVerified = fbResponse.emailVerified
    user.isAnonymous = fbResponse.isAnonymous
    user.photoURL = fbResponse.photoURL
    return user;
  }
}

