import {Injectable} from '@angular/core'
import {Logger, MessageBus} from '@tangential/core'
import {FirebaseProvider, FireBlanket} from '@tangential/firebase-util'
import * as firebase from 'firebase/app'
import {BehaviorSubject, Observable} from 'rxjs/Rx'
import {AuthSubject} from '../../media-type/cdm/auth-subject'
//noinspection TypeScriptPreferShortImport
import {AuthUserKey} from '../../media-type/doc-model/auth-user'
//noinspection TypeScriptPreferShortImport
import {AuthenticationService} from '../authentication-service/authentication-service'

import {Visitor} from './media-type/cdm/visitor'
//noinspection TypeScriptPreferShortImport
import {VisitorPreferences, VisitorPreferencesTransform} from './media-type/cdm/visitor-preferences'
//noinspection TypeScriptPreferShortImport
import {VisitorPreferencesFbPath} from './media-type/doc-model/visitor-preferences'
import {VisitorService} from './visitor-service'
import DataSnapshot = firebase.database.DataSnapshot


@Injectable()
export class FirebaseVisitorService extends VisitorService {

  private db: firebase.database.Database
  private visitorObserver: BehaviorSubject<Visitor>

  constructor(private bus: MessageBus,
              protected logger: Logger,
              private fb: FirebaseProvider, private authService: AuthenticationService) {
    super()
    this.db = fb.app.database()
    this.visitorObserver = new BehaviorSubject(null)
    this.initSubscriptions()
  }

  private initSubscriptions() {
    this.logger.trace(this, '#initSubscriptions')
    this.authService.awaitKnownAuthSubject$().subscribe((subject: AuthSubject) => {
      this.logger.trace(this, '#initSubscriptions', 'Auth user changed', subject)
      if (subject.isSignedIn()) {
        this.getCurrentVisitor(subject).then(visitor => this.visitorObserver.next(visitor))
      } else {
        this.visitorObserver.next(new Visitor(subject, VisitorPreferences.forGuest()))
      }
    })
  }


  visitor$(): Observable<Visitor> {
    return this.visitorObserver.skipWhile(v => v === null)
  }

  /**
   * Waits for the first non-placeholder visitor (e.g. not the default value provided to the behaviour subject).
   * This is basically saying 'wait for the Firebase auth server to respond.
   *
   * Subsequent calls to this method will be provided the same observable instance as the initial call. The has the effect of
   * making the timeoutMils argument effective only on the initial call to this method for the current client session.
   *
   * The returned observable will never complete.
   * @param timeoutMils
   * @returns {Observable<R>}
   */
  private awaitVisitorObserver:Observable<Visitor>
  awaitVisitor$(timeoutMils: number = 10000): Observable<Visitor> {
    /* Wait up to timeout millis for the Firebase Auth to comeback with a response. */
    this.logger.trace(this, '#awaitVisitor$')
    if(!this.awaitVisitorObserver){
      this.awaitVisitorObserver = this.visitor$().timeout(timeoutMils).catch((e) => {
        this.logger.trace(this, 'Timed out')
        return this.visitor$().first().do(v => {
          this.logger.trace(this, 'providing alternate: ', v)
        })
      })
    }
    return this.awaitVisitorObserver
  }

  getCurrentVisitor(subject: AuthSubject): Promise<Visitor> {
    let result: Promise<Visitor>
    let visitor:Visitor
    if(subject.isGuest()){
      visitor = new Visitor(subject, VisitorPreferences.forGuest())
      result = Promise.resolve(visitor)
    } else {
      result = this.getVisitorPreferences(subject.$key).then(prefs => {
        visitor = new Visitor(subject, prefs)
        if (prefs === null) {
          this.setVisitorPreferences(visitor.$key, visitor.prefs)
        }
        return visitor
      }).catch(this.doCatch('#getCurrentVisitor'))
    }
    return result
  }

  getVisitorPreferences(key: AuthUserKey): Promise<VisitorPreferences> {
    let ref = VisitorPreferencesFbPath(this.db, key)
    return FireBlanket.value(ref).then((snap: DataSnapshot) => {
      return VisitorPreferencesTransform.fromDocModel(snap.exists() ? snap.val() : null)
    }).catch(this.doCatch('#getVisitorPreferences'))
  }

  setVisitorPreferences(key: AuthUserKey, prefs: VisitorPreferences): Promise<void> {
    let ref = VisitorPreferencesFbPath(this.db, key)
    return FireBlanket.set(ref, prefs.toDocModel()).catch(this.doCatch('#setVisitorPreferences'))
  }

  updateVisitorPreferences(key: AuthUserKey, prefs: VisitorPreferences): Promise<void> {
    let ref = VisitorPreferencesFbPath(this.db, key)
    return FireBlanket.update(ref, prefs.toDocModel()).catch(this.doCatch('#updateVisitorPreferences'))
  }

  private doCatch(msg: string) {
    return (e) => {
      console.log('FirebaseVisitorService', msg, e && e.message ? e.message : '')
      return Promise.reject(e)
    }
  }

}

