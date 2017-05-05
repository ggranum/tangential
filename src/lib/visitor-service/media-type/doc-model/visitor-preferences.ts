import {ObjMap} from '@tangential/core';
import {AuthUserKey} from '@tangential/authorization-service';
import {VisitorDataFbPath} from '@tangential/visitor-service';

export const VisitorPreferencesFbPath = function (db: firebase.database.Database, key: AuthUserKey):firebase.database.Reference {
  return VisitorDataFbPath(db, key).child('prefs')
}
export interface VisitorPreferencesDm {
  hideCookieWarnings?: boolean
  hiddenTips?: ObjMap<boolean>
}
