import {ObjMap} from '@tangential/core';
import * as firebase from 'firebase'
//noinspection TypeScriptPreferShortImport
import {AuthUserKey} from '../../../../media-type/doc-model/auth-user';
import {VisitorDataFbPath} from './visitor-data';

export const VisitorPreferencesFbPath = function (db: firebase.database.Database, key: AuthUserKey):firebase.database.Reference {
  return VisitorDataFbPath(db, key).child('prefs')
}
export interface VisitorPreferencesDm {
  hideCookieWarnings?: boolean
  hiddenTips?: ObjMap<boolean>
}
