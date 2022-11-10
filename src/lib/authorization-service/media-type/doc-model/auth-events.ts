import * as firebase from 'firebase'
import {SignInEventDm} from './sign-in-event';
import {ObjMap} from '@tangential/core';
import {AuthFirebaseRef} from './auth';
import {AuthUserKey} from './auth-user';


export const AuthEventsFirebaseRef = function(db: firebase.database.Database):firebase.database.Reference {
  return AuthFirebaseRef(db).child('events')
}

export const AuthSignInEventsFirebaseRef = function(db: firebase.database.Database):firebase.database.Reference {
  return AuthEventsFirebaseRef(db).child('signIn')
}

export const AuthSignInEventsByUserFirebaseRef = function(db: firebase.database.Database, subjectKey:AuthUserKey):firebase.database.Reference {
  return AuthEventsFirebaseRef(db).child('byUser').child(subjectKey)
}

export type SignInEventMappings = {[key:string]: boolean}


export interface UserAuthEvents {
  signIn: SignInEventMappings
}

export type ByUserAuthEventMappings = {[key:string]: UserAuthEvents}

export interface AuthEventsDm {
  byUser: ByUserAuthEventMappings
  signIn: ObjMap<SignInEventDm>
}
