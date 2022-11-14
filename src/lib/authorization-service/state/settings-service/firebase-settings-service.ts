import {Injectable} from '@angular/core';

import {MessageBus} from '@tangential/core';
import {FirebaseProvider, FireBlanket} from '@tangential/firebase-util';

import {Database} from '@firebase/database'
import {getAuth} from 'firebase/auth'
import { getDatabase } from "firebase/database";


import {Auth} from '@firebase/auth'

import {Observable} from 'rxjs';
import {map} from 'rxjs/operators'
//noinspection ES6PreferShortImport
import {AuthSettingsService} from './settings-service';
//noinspection ES6PreferShortImport
import {AuthSettings, AuthSettingsTransform} from '../../media-type/cdm/auth-settings';
//noinspection ES6PreferShortImport
import {AuthSettingsDm, AuthSettingsFirebaseRef} from '../../media-type/doc-model/auth-settings';



@Injectable()
export class FirebaseAuthSettingsService extends AuthSettingsService {

  private auth: Auth
  private db: Database
  private authSettingsObserver: Observable<AuthSettings>

  constructor(bus: MessageBus,
              private fb: FirebaseProvider) {
    super()
    this.auth = getAuth(fb.app)
    console.log("===A===", this.fb, this.fb.app)
    this.db = getDatabase(this.fb.app)
    this.init()
  }

  private init(){
    this.authSettingsObserver = FireBlanket.awaitValue$(AuthSettingsFirebaseRef(this.db)).pipe(
      map(snap => snap.val()),
      map((dm:AuthSettingsDm) => AuthSettingsTransform.fromDocModel(dm)))
  }


  public authSettings$(): Observable<AuthSettings> {
    return this.authSettingsObserver
  }

}

