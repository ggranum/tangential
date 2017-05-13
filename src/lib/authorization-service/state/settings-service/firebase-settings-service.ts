import {Injectable} from '@angular/core';

import {MessageBus} from '@tangential/core';
import {FirebaseProvider, FireBlanket} from '@tangential/firebase-util';
import * as firebase from 'firebase/app';
import {Observable} from 'rxjs/Observable';
//noinspection TypeScriptPreferShortImport
import {AuthSettingsService} from './settings-service';
//noinspection TypeScriptPreferShortImport
import {AuthSettings, AuthSettingsTransform} from '../../media-type/cdm/auth-settings';
//noinspection TypeScriptPreferShortImport
import {AuthSettingsDm, AuthSettingsFirebaseRef} from '../../media-type/doc-model/auth-settings';
import EmailAuthProvider = firebase.auth.EmailAuthProvider


@Injectable()
export class FirebaseAuthSettingsService extends AuthSettingsService {

  private auth: firebase.auth.Auth
  private db: firebase.database.Database
  private authSettingsObserver: Observable<AuthSettings>

  constructor(protected bus: MessageBus,
              private fb: FirebaseProvider) {
    super()
    this.auth = fb.app.auth()
    this.db = this.fb.app.database()
    this.init()
  }

  private init(){
    this.authSettingsObserver = FireBlanket.awaitValue$(AuthSettingsFirebaseRef(this.db))
      .map(snap => snap.val())
      .map((dm:AuthSettingsDm) => AuthSettingsTransform.fromDocModel(dm))
  }


  public authSettings$(): Observable<AuthSettings> {
    return this.authSettingsObserver
  }

}

