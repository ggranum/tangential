import {Database, DatabaseReference} from '@firebase/database'
import {child, ref} from 'firebase/database'
//noinspection ES6PreferShortImport
import {AuthUserKey} from '../../../../media-type/doc-model/auth-user';
import {VisitorEventsDocModel} from './visitor-events';
import {VisitorPreferencesDm} from './visitor-preferences';


export const VisitorDataFbPath = function (db: Database, key: AuthUserKey): DatabaseReference {
  return child(ref(db, '/data/byUser/'), key)
}

export interface VisitorDataDm {
  events: VisitorEventsDocModel
  prefs: VisitorPreferencesDm
}
