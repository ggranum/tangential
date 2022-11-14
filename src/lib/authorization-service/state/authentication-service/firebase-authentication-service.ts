import {Injectable} from '@angular/core';

import {Auth, User} from '@firebase/auth'
import {Database} from '@firebase/database'
import {child, getDatabase} from 'firebase/database';
import {
  createUserWithEmailAndPassword, EmailAuthProvider, getAuth, linkWithCredential, sendPasswordResetEmail, signInAnonymously,
  signInWithEmailAndPassword
} from 'firebase/auth';


import {generatePushID, Logger, MessageBus, ResolveVoid} from '@tangential/core';
import {FirebaseProvider, FireBlanket} from '@tangential/firebase-util';
import {BehaviorSubject, Observable} from 'rxjs';
import {first, skip, skipWhile} from 'rxjs/operators'
import {AuthSubject, AuthSubjectTransform} from '../../media-type';
import {AuthUser, AuthUserTransform} from '../../media-type';
import {SessionInfoCdm} from '../../media-type';
//noinspection ES6PreferShortImport
import {SignInEvent, SignInEventTransform} from '../../media-type';
//noinspection ES6PreferShortImport
import {AuthSignInEventsByUserFirebaseRef, AuthSignInEventsFirebaseRef} from '../../media-type/doc-model/auth-events';
//noinspection ES6PreferShortImport
import {AuthUserDm, AuthUserKey, AuthUsersFirebaseRef} from '../../media-type';
//noinspection ES6PreferShortImport
import {EmailPasswordCredentials} from '../../media-type';
import {SignInState, SignInStates} from '../../sign-in-state';
import {UserService} from '../user-service/user-service';
import {AuthenticationService} from './authentication-service';


interface FirebaseAuthResponse {
  displayName: string
  email: string
  emailVerified: boolean
  isAnonymous: boolean
  photoURL: string
  uid: string
}

@Injectable()
export class FirebaseAuthenticationService extends AuthenticationService {

  signInStateValue: SignInState
  private authSubjectObserver: BehaviorSubject<AuthSubject>
  private readonly auth: Auth
  private readonly db: Database

  constructor(bus: MessageBus,
              protected logger: Logger,
              private fb: FirebaseProvider,
              protected userService: UserService) {
    super()
    this.auth = getAuth(fb.app)
    this.db = getDatabase(fb.app)
    this.init()
  }

  public obtainAcceptLanguageHeader(): Promise<SessionInfoCdm> {
    let url = 'https://us-central1-' + this.fb.app.options['authDomain'].split('.')[0] + '.cloudfunctions.net/visitorInfoEndpoint/';
    return new Promise((resolve, reject) => {
      this.auth.currentUser.getIdToken().then((token) => {
        this.logger.debug(this, '#obtainAcceptLanguageHeader', 'Sending visitor info request.');
        const req = new XMLHttpRequest();
        req.onload = () => {
          let rawHeaders = JSON.parse(req.responseText) || {}
          let sessionInfo = SessionInfoCdm.fromHeaders(rawHeaders)
          this.logger.debug(this, '#obtainAcceptLanguageHeader::onload', sessionInfo.city)
          resolve(sessionInfo)
        }
        req.onerror = (ev) => {
          this.logger.error(this, '#obtainAcceptLanguageHeader::onerror', req.statusText)
          reject(ev)
        }
        req.open('GET', url, true);
        req.setRequestHeader('Authorization', 'Bearer ' + token);
        req.send();
      });
    })
  }

  addSignInEvent(subject: AuthSubject): Promise<void> {
    let refId = generatePushID()
    let ref = child(AuthSignInEventsFirebaseRef(this.db), refId)
    let mapRef = child(AuthSignInEventsByUserFirebaseRef(this.db, subject.$key), refId)
    let event = SignInEvent.forSubject(subject)
    return FireBlanket.set(ref, SignInEventTransform.toDocModel(event)).then(() => {
      return FireBlanket.set(mapRef, event.whenMils)
    })
  }

  authSubject$(): Observable<AuthSubject> {
    return this.authSubjectObserver
  }

  awaitKnownAuthSubject$(): Observable<AuthSubject> {
    return this.authSubjectObserver.pipe(skipWhile(subject => subject.signInState === SignInStates.unknown))
  }

  /**
   * Auth state changes - including which user is set as currentAuthUser - are handled by listening for
   * changes sent down by firebase, NOT by manually setting the currentUser here. We have to set the login state
   * here because that information can't be derived from what is supplied by firebase.
   *
   * @param payload
   * @param suppressUserInfoSynchronization
   * @returns {Promise<void>}
   */
  signInWithEmailAndPassword(payload: EmailPasswordCredentials, suppressUserInfoSynchronization: boolean = false): Promise<void> {
    this.logger.trace(this, '#signInWithEmailAndPassword', 'enter', payload.email)
    this.setSignInState(SignInStates.signingIn)
    const loginCfg = {
      email:    payload.email,
      password: payload.password
    }
    /** @todo: ggranum: This can clearly be improved. At least figure why it was written this way and document it.  */
    return new Promise<void>((resolve, reject) => {
      let readyToResolve = true
      this.authSubjectObserver.pipe(
        skip(1),
        first()
      ).subscribe(() => {
        this.logger.trace(this, '#signInWithEmailAndPassword:resolving', payload.email)
        resolve(ResolveVoid)
      })
      signInWithEmailAndPassword(this.auth, loginCfg.email, loginCfg.password).catch((reason) => {
        this.setSignInState(SignInStates.signInFailed)
        reject(reason)
      })
    });
  }

  signInAnonymously(): Promise<void> {
    this.logger.trace(this, '#signInAnonymously')
    this.setSignInState(SignInStates.signingIn)
    return new Promise<void>((resolve, reject) => {
      signInAnonymously(this.auth)
        .then((fbAuthState) => {
          const userDm = this.subjectFromFirebaseResponse(fbAuthState.user)
          return this.createOwnUserAccount(AuthUserTransform.fragmentFromDocModel(userDm, userDm.$key)).then(() => {
            this.logger.trace(this, '#signInAnonymously', 'created anonymous user')
            this.setSignInState(SignInStates.signedInAnonymous)
            resolve(ResolveVoid)
          })
        })
        .catch((reason) => {
          this.setSignInState(SignInStates.signInFailed)
          reject(reason)
        })
    });
  }

  createUserWithEmailAndPassword(payload: EmailPasswordCredentials): Promise<void> {
    this.setSignInState(SignInStates.signingUp)
    return new Promise<void>((resolve, reject) => {
      createUserWithEmailAndPassword(this.auth, payload.email, payload.password)
        .then((fbAuthState) => {
          const userDm = this.subjectFromFirebaseResponse(fbAuthState.user)
          return this.createOwnUserAccount(AuthUserTransform.fragmentFromDocModel(userDm, userDm.$key)).then(() => {
            this.logger.trace(this, 'created user', userDm.email)
            this.handleUserSignedIn(userDm).then(hydratedUser => {
              this.setCurrentUser(hydratedUser)
              resolve(undefined)
            })
          })
        })
        .catch((reason) => {
          this.setSignInState(SignInStates.signUpFailed)
          reject(reason)
        })
    })
  }

  createOwnUserAccount(user: AuthUser): Promise<void> {
    const cRef = child(AuthUsersFirebaseRef(this.db), user.$key)
    const dm = AuthUserTransform.toDocModel(user)
    return FireBlanket.set(cRef, dm)
  }

  updateOwnUserAccount(user: AuthUser): Promise<void> {
    const cRef = child(AuthUsersFirebaseRef(this.db), user.$key)
    const dm = AuthUserTransform.toDocModel(user)
    this.logger.trace(this, '#update', JSON.stringify(dm))
    return FireBlanket.update(cRef, dm).catch(e => {
      this.logger.error(this, '#update:failed')
      throw e
    })
  }

  removeOwnUserAccount(childKey: AuthUserKey): Promise<void> {
    const cRef = child(AuthUsersFirebaseRef(this.db), childKey)
    return FireBlanket.remove(cRef)
  }

  signOut(): Promise<void> {
    this.logger.info(this, '#signOut', this.auth.currentUser ? this.auth.currentUser.uid : '{no user}')
    if (this.signInStateValue === SignInStates.signedOut) {
      throw new Error('Cannot sign out: No user is signed in.')
    }
    if (this.signInStateValue === SignInStates.signingOut) {
      throw new Error('Cannot sign out: User is already signing out.')
    }
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
        this.removeOwnUserAccount(_authUser.uid).then(() => {
          this.auth.currentUser.delete().then(resolve)
        }).catch((reason) => reject(reason))
      } else {
        reject('NOT_SIGNED_IN')
      }
    })
  }

  public sendResetPasswordEmail(emailAddress: string): Promise<void> {
    return <Promise<void>>sendPasswordResetEmail(this.auth, emailAddress)
  }

  public linkAnonymousAccount(payload: EmailPasswordCredentials): Promise<void> {
    this.setSignInState(SignInStates.signingUp)
    const credential = EmailAuthProvider.credential(payload.email, payload.password);
    return <Promise<void>>linkWithCredential(this.auth.currentUser, credential)
      .then((fbAuthState) => {
        this.logger.trace(this, '#linkAnonymousAccount', 'linked user', fbAuthState.user.uid, fbAuthState.user.email)
        let dm = this.subjectFromFirebaseResponse(fbAuthState.user)
        const newAuthUser = AuthUserTransform.fragmentFromDocModel(dm, dm.$key);
        return this.updateOwnUserAccount(newAuthUser).then(() => {
          this.logger.trace(this, '#linkAnonymousAccount', 'updated linked user data', newAuthUser.email)
          return this.handleUserSignedIn(newAuthUser).then(hydratedUser => {
            this.setCurrentUser(hydratedUser)
          })
        })
      })
      .catch((reason) => {
        this.setSignInState(SignInStates.signUpFailed)
        throw reason
      })
  }

  private init() {
    this.authSubjectObserver = new BehaviorSubject(AuthSubject.UnknownSubject)
    this.auth.onAuthStateChanged((fbAuthState: User) => {
      this.handleAuthStateChanged(fbAuthState)
    })
    this.setSignInState(SignInStates.unknown)
  }

  private handleAuthStateChanged(firebaseAuthResponse: User) {
    if (this.signInStateValue === SignInStates.signingUp) {
      /* This state change will be handled by the '#createUserWithEmailAndPassword' method. */
      this.logger.trace(this, '#handleAuthStateChanged:signingUp', 'User is signing up')
    } else if (this.isSignedInResponse(firebaseAuthResponse)) {
      this.logger.trace(this,
        '#handleAuthStateChanged:signedIn',
        firebaseAuthResponse.uid,
        firebaseAuthResponse.email,
        firebaseAuthResponse.isAnonymous)
      let firebaseResponse: AuthUserDm = this.subjectFromFirebaseResponse(firebaseAuthResponse)
      this.handleUserSignedIn(firebaseResponse).then(subject => {
        this.logger.trace(this, '#handleAuthStateChanged:Subject Resolved', subject.$key, subject.email, subject.isAnonymous)
        this.setCurrentUser(subject)
      })
    } else {
      this.logger.trace(this, '#handleAuthStateChanged', 'Visitor is Guest or has signed out')
      this.setCurrentUser(AuthSubject.GuestSubject)
    }
  }

  private setCurrentUser(subject: AuthSubject): void {
    this.logger.trace(this, '#setCurrentUser', subject ? subject.$key : 'null')
    this.setSignInState(subject.signInState)
    this.authSubjectObserver.next(subject)
  }

  private isSignedInResponse(firebaseAuthResponse: FirebaseAuthResponse) {
    return firebaseAuthResponse;
  }

  private setSignInState(newState: SignInState) {
    if (this.signInStateValue !== newState) {
      this.logger.trace(this, '#setSignInState', newState)
      this.signInStateValue = newState
    }
  }

  private subjectFromFirebaseResponse(user: User): AuthUserDm {
    const subject: AuthUserDm = {}
    subject.$key = user.uid
    subject.displayName = user.displayName
    subject.email = user.email
    subject.emailVerified = user.emailVerified
    subject.isAnonymous = user.isAnonymous
    subject.photoURL = user.photoURL
    return subject;
  }

  private handleUserSignedIn(iamServiceAuthDm: AuthUserDm): Promise<AuthSubject> {
    let user: AuthUser
    return this.userService.getUser(iamServiceAuthDm.$key)
      .then((u: AuthUser) => {
        user = u
        user = AuthUserTransform.applyDocModelTo(iamServiceAuthDm, user)
        return this.obtainAcceptLanguageHeader()
      }).then((sessionInfo: SessionInfoCdm) => {
        const signInState = user.isAnonymous ? SignInStates.signedInAnonymous : SignInStates.signedIn
        const subject = AuthSubjectTransform.from(user, signInState, sessionInfo)
        subject.lastSignInMils = Date.now()
        subject.lastSignInIp = sessionInfo.ipAddress
        this.updateOwnUserAccount(subject).catch(e => {
          /* By not waiting for this response we can cause problems in unit tests. In real use, however, waiting is a waste
           * of at least tens of milliseconds.  */
          this.logger.error(this, '#updateUserAuthData', 'Could not update user data', subject.email, e.message)
        })
        return subject
      })
  }

}

