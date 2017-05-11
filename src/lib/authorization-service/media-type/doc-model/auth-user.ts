import {AuthFirebaseRef} from './auth';
export type AuthUserKey = string


export const AuthUsersFirebaseRef = function (db: firebase.database.Database) {
  return AuthFirebaseRef(db).child('users')
}



/**
 * An AuthUser is the most basic user type. It represents any 'User' in the system; any entity that has signed in at some point.
 * AuthUser does not contain information directly related to the application - although the application does likely care about the
 * user's email, display name and avatar. AuthUser contains information that is related to identification.
 *
 * An AuthSubject is an AuthUser that is currently active; e.g. only the user currently signed in can legitimately be claimed to be
 * an authSubject.
 *
 * Applications will likely subclass or otherwise augment this AuthUser class with another 'AppUser' that contains things relevant to the
 * specific application, including Preferences and other saved application state.
 *
 */
export interface AuthUserDm {
  $key?: AuthUserKey
  createdMils?: number
  editedMils?: number
  email?: string
  displayName?: string
  emailVerified?: boolean
  disabled?: boolean
  isAnonymous?: boolean
  lastSignInMils?: number
  lastSignInIp?: string
  photoURL?: string
}


