import * as firebase from 'firebase'
//noinspection TypeScriptPreferShortImport
import {AuthUserKey} from '../../../../media-type/doc-model/auth-user';
import {VisitorEventsDocModel} from './visitor-events';
import {VisitorPreferencesDm} from './visitor-preferences';


export const VisitorDataFbPath = function (db: firebase.database.Database, key: AuthUserKey): firebase.database.Reference {
  return db.ref('/data/byUser/').child(key)
}

export interface VisitorDataDm {
  events: VisitorEventsDocModel
  prefs: VisitorPreferencesDm
}
