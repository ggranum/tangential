import {VisitorEventsDocModel, VisitorPreferencesDm} from '@tangential/visitor-service';
import {AuthUserKey} from '../../../authorization-service/media-type/doc-model/auth-user';


export const VisitorDataFbPath = function (db: firebase.database.Database, key: AuthUserKey):firebase.database.Reference {
  return db.ref('/data/byUser/').child(key)
}

export interface VisitorDataDm {
  prefs: VisitorPreferencesDm
  events: VisitorEventsDocModel
}
