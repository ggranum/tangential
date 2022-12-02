import {ObjMap} from '@tangential/core';
import {Database, DatabaseReference} from '@firebase/database'
import {child} from 'firebase/database'
//noinspection ES6PreferShortImport
import {AuthUserKey} from '../../../../media-type/doc-model/auth-user';
import {VisitorDataFbPath} from './visitor-data';

export const VisitorPreferencesFbPath = function (db: Database, key: AuthUserKey):DatabaseReference {
  return child(VisitorDataFbPath(db, key), 'prefs')
}
export interface VisitorPreferencesDm {
  hideCookieWarnings?: boolean
  hiddenTips?: ObjMap<boolean>
}
