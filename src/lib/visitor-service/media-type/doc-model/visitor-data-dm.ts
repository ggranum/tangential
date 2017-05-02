import {VisitorEventsDocModel, VisitorPreferencesDocModel} from '@tangential/visitor-service';

export interface VisitorDataDocModel {
  prefs: VisitorPreferencesDocModel
  events: VisitorEventsDocModel
}
