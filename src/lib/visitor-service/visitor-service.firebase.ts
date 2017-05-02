import {Injectable} from '@angular/core'
import {AuthService, AuthUser, EmailPasswordCredentials, SignInState, SignInStates} from '@tangential/authorization-service'
import {Logger, MessageBus} from '@tangential/core'
import {FirebaseProvider, FireBlanket} from '@tangential/firebase-util'
import {Visitor, VisitorPreferences, VisitorPreferencesJson} from '@tangential/visitor-service'
import * as firebase from 'firebase/app'
import {Observable, BehaviorSubject} from 'rxjs/Rx'
import {VisitorService} from './visitor-service'
import DataSnapshot = firebase.database.DataSnapshot;
import Reference = firebase.database.Reference

const PlaceholderVisitor = new Visitor(null, VisitorPreferences.forGuest(), SignInStates.unknown)

@Injectable()
export class FirebaseVisitorService extends VisitorService {

  private db: firebase.database.Database
  private ref: Reference
  private currentSignInState: SignInState
  private path: string
  private subject: BehaviorSubject<Visitor>

  constructor(private bus: MessageBus, private fb: FirebaseProvider, private authService: AuthService) {
    super()
    this.db = fb.app.database()
    this.subject = new BehaviorSubject(PlaceholderVisitor)
    this.initSubscriptions()
  }

  private initSubscriptions() {
    this.authService.signInState$().subscribe({
      next: (state) => {
        this.currentSignInState = state
        Logger.trace(this.bus, this, 'Sign-in state changed', state)
      }
    })
    this.authService.authUser$().subscribe((authUser: AuthUser) => {
      if (authUser) {
        Logger.trace(this.bus, this, 'Auth user changed', authUser)
        this.path = `/data/byUser/${authUser.$key}/prefs/`
        this.ref = this.db.ref(this.path)
        this.getVisitor(authUser).then(visitor => this.subject.next(visitor))
      } else {
        Logger.trace(this.bus, this, 'Auth user changed', 'SignInState:', this.currentSignInState)
        this.subject.next(new Visitor(null, VisitorPreferences.forGuest(), this.currentSignInState))
      }
    })
  }

  setVisitorPreferences(visitor: Visitor): Promise<void> {
    const prefs: VisitorPreferences = visitor.prefs
    const ref = this.db.ref(this.path)
    return FireBlanket.set(ref, prefs.toJson(false))
  }

  visitor$(): Observable<Visitor> {
    return this.subject
  }


  /**
   * Waits for the first non-placeholder visitor (e.g. not the default value provided to the behaviour subject).
   * This is basically saying 'wait for the Firebase auth server to respond.
   *
   * The returned observable will never complete.
   * @param timeoutMils
   * @returns {Observable<R>}
   */
  awaitVisitor$(timeoutMils: number = 5000): Observable<Visitor> {
    /* Wait up to timeout millis for the Firebase Auth to comeback with a response. */
    return this.visitor$().first(v => !v.isPlaceholder()).timeout(timeoutMils).catch((e) => {
      Logger.trace(this.bus, this, 'Timed out')
      return this.visitor$().first().do(v => {
        Logger.trace(this.bus, this, 'providing alternate: ', v)
      })
    }).flatMap(x => this.visitor$())
  }

  getVisitor(authUser): Promise<Visitor> {
    return FireBlanket.value(this.ref).then((snap: DataSnapshot) => {
      const prefs = new VisitorPreferences(snap.val())
      const visitor = new Visitor(authUser, prefs, this.currentSignInState)
      if (!snap.exists()) {
        this.setVisitorPreferences(visitor)
      }
      return visitor
    })

  }

  updateVisitorPreferences(visitor: Visitor): Promise<void> {
    const prefs: VisitorPreferencesJson = visitor.prefs.toJson(false)
    const ref = this.db.ref(this.path)
    return FireBlanket.update(ref, prefs).catch((e) => {
      console.error('FirebaseVisitorService', 'Error updating visitor', e)
      console.log('     ', prefs)
    })
  }


  public createUserWithEmailAndPassword(payload: EmailPasswordCredentials): Promise<Visitor> {
    Logger.trace(this.bus, this, '#createUserWithEmailAndPassword', 'enter', payload.email)
    return this.authService.createUserWithEmailAndPassword(payload).then((authUser: AuthUser) => {
      return this.awaitVisitor$().first(v => !v.isGuest()).do((v) => {
        Logger.trace(this.bus, this, '#createUserWithEmailAndPassword', 'signed in', v.authUser.email)
      }).toPromise()
    })
  }

  public signInWithEmailAndPassword(authInfo: EmailPasswordCredentials): Promise<Visitor> {
    return this.authService.signInWithEmailAndPassword(authInfo).then(() => {
      return this.awaitVisitor$().first(v => !v.isGuest()).do((v) => {
        Logger.trace(this.bus, this, '#signInWithEmailAndPassword', 'signed in', v.authUser.email)
      }).toPromise()
    })
  }

  public signInAnonymously(): Promise<Visitor> {
    return this.authService.signInAnonymously().then(() => {
      return this.awaitVisitor$().first(v => !v.isGuest()).do((v) => {
        Logger.trace(this.bus, this, '#signInAnonymously', 'signed in', v.authUser.email)
      }).toPromise()
    })
  }

  public signOut(): Promise<void> {
    return this.authService.signOut()
  }

  public linkAnonymousAccount(authUser: AuthUser, newCredentials: EmailPasswordCredentials): Promise<Visitor> {
    Logger.trace(this.bus, this, '#linkAnonymousAccount', 'enter', authUser.$key, newCredentials.email)
    return this.authService.linkAnonymousAccount(authUser, newCredentials).then(() => {
      return this.awaitVisitor$().first(v => !v.isGuest()).do((v) => {
        Logger.trace(this.bus, this, '#linkAnonymousAccount', 'signed in', v.authUser.email)
      }).toPromise()
    })
  }
}

