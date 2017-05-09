import {Injectable} from '@angular/core';
import {AuthenticationService, AuthSubject, AuthUserKey} from '@tangential/authorization-service';
import {Logger, MessageBus, ResolveVoid} from '@tangential/core';
import {FirebaseProvider, FireBlanket} from '@tangential/firebase-util';
import * as firebase from 'firebase/app';
import {BehaviorSubject, Observable} from 'rxjs/Rx';
import {VisitorService} from './visitor-service';

import {Visitor} from './media-type/cdm/visitor';
//noinspection TypeScriptPreferShortImport
//noinspection TypeScriptPreferShortImport
import {VisitorPreferences, VisitorPreferencesTransform} from './media-type/cdm/visitor-preferences';
//noinspection TypeScriptPreferShortImport
import {VisitorPreferencesFbPath} from './media-type/doc-model/visitor-preferences';
import DataSnapshot = firebase.database.DataSnapshot;
import Reference = firebase.database.Reference


@Injectable()
export class FirebaseVisitorService extends VisitorService {

  private db: firebase.database.Database
  private visitorObserver: BehaviorSubject<Visitor>

  constructor(private bus: MessageBus, private fb: FirebaseProvider, private authService: AuthenticationService) {
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

