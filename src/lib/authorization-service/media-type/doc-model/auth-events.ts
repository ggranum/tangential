
import {Database, DatabaseReference} from '@firebase/database'
import {child} from 'firebase/database'

import {SignInEventDm} from './sign-in-event';
import {ObjMap} from '@tangential/core';
import {AuthFirebaseRef} from './auth';
import {AuthUserKey} from './auth-user';


export const AuthEventsFirebaseRef = function(db: Database):DatabaseReference {
  return child(AuthFirebaseRef(db), 'events')
}

export const AuthSignInEventsFirebaseRef = function(db: Database):DatabaseReference {
  return child(AuthEventsFirebaseRef(db), 'signIn')
}

export const AuthSignInEventsByUserFirebaseRef = function(db: Database, subjectKey:AuthUserKey):DatabaseReference {
  return child(AuthEventsFirebaseRef(db), `byUser/${subjectKey}`)
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
