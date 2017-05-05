import {Injectable} from '@angular/core'
import {AuthService, SignInState, SignInStates} from '@tangential/authorization-service'
import {Logger, MessageBus} from '@tangential/core'
import {FirebaseProvider, FireBlanket} from '@tangential/firebase-util'
import {Visitor, VisitorPreferencesCdm, VisitorPreferencesDm, VisitorPreferencesFbPath} from '@tangential/visitor-service'
import * as firebase from 'firebase/app'
import {Observable, BehaviorSubject} from 'rxjs/Rx'
import {VisitorService} from './visitor-service'
import DataSnapshot = firebase.database.DataSnapshot;
import Reference = firebase.database.Reference

import {AuthSubject} from '@tangential/authorization-service';


@Injectable()
export class FirebaseVisitorService extends VisitorService {

  private db: firebase.database.Database
  private ref: Reference
  private visitorObserver: BehaviorSubject<Visitor>

  constructor(private bus: MessageBus, private fb: FirebaseProvider, private authService: AuthService) {
    super()
    this.db = fb.app.database()
    this.visitorObserver = new BehaviorSubject(null)
    this.initSubscriptions()
  }

  private initSubscriptions() {
    Logger.trace(this.bus, this, '#initSubscriptions')
    this.authService.awaitKnownAuthSubject$().subscribe((subject: AuthSubject) => {
      Logger.trace(this.bus, this, '#initSubscriptions', 'Auth user changed', subject)
      if (subject.isSignedIn()) {
        this.ref = VisitorPreferencesFbPath(this.db, subject.$key)
        this.getCurrentVisitor(subject).then(visitor => this.visitorObserver.next(visitor))
      } else {
        this.visitorObserver.next(new Visitor(subject, VisitorPreferencesCdm.forGuest()))
      }
    })
  }

  setVisitorPreferences(visitor: Visitor): Promise<void> {
    const prefs: VisitorPreferencesCdm = visitor.prefs
    return FireBlanket.set(this.ref, prefs.toDocModel())
  }

  visitor$(): Observable<Visitor> {
    return this.visitorObserver.skipWhile(v => v === null)
  }

  /**
   * Waits for the first non-placeholder visitor (e.g. not the default value provided to the behaviour subject).
   * This is basically saying 'wait for the Firebase auth server to respond.
   *
   * The returned observable will never complete.
   * @param timeoutMils
   * @returns {Observable<R>}
   */
  awaitVisitor$(timeoutMils: number = 10000): Observable<Visitor> {
    /* Wait up to timeout millis for the Firebase Auth to comeback with a response. */
    Logger.trace(this.bus, this, '#awaitVisitor$')
    return this.visitor$().timeout(timeoutMils).catch((e) => {
      Logger.trace(this.bus, this, 'Timed out')
      return this.visitor$().first().do(v => {
        Logger.trace(this.bus, this, 'providing alternate: ', v)
      })
    })
  }

  getCurrentVisitor(subject:AuthSubject): Promise<Visitor> {
    return FireBlanket.value(this.ref).then((snap: DataSnapshot) => {
      const prefs = VisitorPreferencesCdm.from(snap.exists() ? snap.val() : {})
      const visitor = new Visitor(subject, prefs)
      if (!snap.exists()) {
        this.setVisitorPreferences(visitor)
      }
      return visitor
    })

  }

  updateVisitorPreferences(visitor: Visitor): Promise<void> {
    const prefs: VisitorPreferencesDm = visitor.prefs.toDocModel()
    return FireBlanket.update(this.ref, prefs).catch((e) => {
      console.error('FirebaseVisitorService', 'Error updating visitor', e)
      console.log('     ', prefs)
    })
  }

}

