import {VisitorPreferences} from './visitor-preferences';
import {VisitorEvents} from './visitor-events';
//noinspection ES6PreferShortImport
import {AuthSubject} from '../../../../media-type/cdm/auth-subject';
//noinspection ES6PreferShortImport
import {AuthUserKey} from '../../../../media-type/doc-model/auth-user';


/**
 *
 * "Current User" would perhaps be a better term.
 *
 * This is a stub that will be expanded into something more akin to an 'AppUser' class, and a 'CurrentAppUser' subclass.
 * CurrentAppUser (this class) will have a subject, while AppUser will not.
 *
 * As of this moment there is no way to explore all the application data for all users in the system. Which is fair, because consumers
 * of Tangential will need to write their own application data model, and Tangential really has very little to offer 'out of the box',
 * since we have no idea what the shape of that data model will be.
 *
 */
export class Visitor {

  subject: AuthSubject
  events: VisitorEvents
  prefs: VisitorPreferences

  constructor(subject: AuthSubject, prefs: VisitorPreferences) {
    this.subject = subject;
    this.prefs = prefs || new VisitorPreferences();
  }

  get $key():AuthUserKey {
    return this.subject.$key
  }

}
