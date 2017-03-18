import {Injectable, NgZone} from "@angular/core";
import {BehaviorSubject, Observable} from "rxjs";
import {AuthPermission, AuthRole, AuthUser, AuthUserIF, EmailPasswordCredentials} from "@tangential/media-types";
import {FirebaseProvider} from "@tangential/firebase-util";
//noinspection TypeScriptPreferShortImport
import {VisitorService} from "./visitor-service";
import {UserService} from "../user/user-service";
import {SignInState} from "../../sign-in-state";

const SIGNED_IN_STATES = [
  SignInState.signedIn,
  SignInState.newAccount,
  SignInState.signedInAnonymous,
].sort()

@Injectable()
export class FirebaseVisitorService extends VisitorService {

  redirectUrl: string;

  private auth: firebase.auth.Auth
  private signInStateValue: SignInState
  private signInStateSubject: BehaviorSubject<SignInState>
  private visitorSubject: BehaviorSubject<AuthUser>

  private _currentVisitor: AuthUser

  constructor(public fb: FirebaseProvider, private _userService: UserService, private _zone:NgZone) {
    super()
    this.auth = fb.app.auth()
    this._initSubjects(this.auth)
    this.setSignInState(SignInState.unknown)
  }

  private _initSubjects(auth: firebase.auth.Auth) {
    this.visitorSubject = new BehaviorSubject(null)
    this.signInStateSubject = new BehaviorSubject(SignInState.unknown)
    this._watchAuthState(auth, this.visitorSubject)
  }

  private _watchAuthState(auth:firebase.auth.Auth, subject:BehaviorSubject<AuthUser>){
    auth.onAuthStateChanged((fbAuthState:any) => {
      let visitor: AuthUser = null
      if (fbAuthState) {
        visitor = new AuthUser(this.userFromFirebaseResponse(fbAuthState))
        this.setSignInState(visitor.isAnonymous ? SignInState.signedInAnonymous : SignInState.signedIn)
      }
      else {
        this.setSignInState(SignInState.signedOut)
      }
      this._currentVisitor = visitor
      subject.next(visitor)
    })
  }

  private setSignInState(newState: SignInState) {
    if (this.signInStateValue !== newState) {
      this.signInStateValue = newState
      this._zone.run(() => this.signInStateSubject.next(this.signInStateValue))
    }
  }

  signInWithEmailAndPassword(payload: EmailPasswordCredentials, suppressUserInfoSynchronization: boolean = false): Promise<AuthUser> {
    this.setSignInState(SignInState.signingIn)
    let loginCfg = {
      email: payload.email,
      password: payload.password
    }
    return new Promise((resolve, reject) => {
      this.auth.signInWithEmailAndPassword(loginCfg.email, loginCfg.password)
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
                  this.setSignInState(SignInState.signedIn)
                  resolve(authUser)
                }).catch((reason)=>{
                  reject(reason)
                })
              } else {
                this.setSignInState(SignInState.signedIn)
                resolve(visitor)
              }
            }
          }).catch((reason) =>{
            reject(reason)
          })
        }).catch((reason) => {
          this.setSignInState(SignInState.signInFailed)
          reject(reason)
        })
    });
  }

  signInAnonymously(): Promise<AuthUser> {
    this.setSignInState(SignInState.signingIn)
    return new Promise((resolve, reject) => {
      this.auth.signInAnonymously()
        .then((fbAuthState) => {
          this.setSignInState(SignInState.signedInAnonymous)
          resolve(new AuthUser(this.userFromFirebaseResponse(fbAuthState)))
        })
        .catch((reason) => {
          this.setSignInState(SignInState.signInFailed)
          reject(reason)
        })
    });
  }

  createUserWithEmailAndPassword(payload: EmailPasswordCredentials): Promise<AuthUser> {
    this.setSignInState(SignInState.signingUp)
    return new Promise((resolve, reject) => {
      this.auth.createUserWithEmailAndPassword(payload.email, payload.password)
        .then((fbAuthState) => {
          const authUser = new AuthUser(this.userFromFirebaseResponse(fbAuthState));
          return this._userService.create(authUser).then(() => {
            this.setSignInState(SignInState.signedIn)
            resolve(authUser)
          })
        })
        .catch((reason) => {
          this.setSignInState(SignInState.signUpFailed)
          reject(reason)
        })
    })
  }

  loadVisitorPermissions(visitor: AuthUser): Observable<AuthUser> {
    return Observable.of(visitor)
  }

  signOut(): Promise<void> {
    this.setSignInState(SignInState.signingOut)
    return new Promise<void>((resolve, reject) => {
      this.auth.signOut().then(() => {
        this.setSignInState(SignInState.signedOut)
        resolve()
      }).catch(() => {
        this.setSignInState(this.auth.currentUser ? SignInState.signedIn : SignInState.signedOut)
        reject()
      })
    })
  }

  signOnObserver(): Observable<AuthUser> {
    return this.visitorSubject
  }

  deleteAccount(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      let _authUser = this.auth.currentUser
      if (_authUser) {
        this._userService.remove(_authUser.uid).then(() => {
          this.auth.currentUser.delete().then(resolve)
        }).catch((reason) => reject(reason))
      }
      else {
        reject("NOT_SIGNED_IN")
      }
    })
  }

  signInState$(): Observable<SignInState> {
    return this.signInStateSubject
  }

  signInState(): SignInState {
    return this.signInStateValue
  }

  isVisitorSignedIn():boolean {
    return SIGNED_IN_STATES.indexOf(this.signInStateValue) > -1
  }


  getEffectivePermissions():Promise<AuthPermission[]> {
    return this._userService.getEffectivePermissionsForUser(this._currentVisitor)
  }

  getGrantedPermissions():Promise<AuthPermission[]> {
    return this._userService.getGrantedPermissionsForUser(this._currentVisitor)
  }

  getRoles():Promise<AuthRole[]> {
    return this._userService.getRolesForUser(this._currentVisitor)
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

