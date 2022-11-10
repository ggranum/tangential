import * as firebase from 'firebase'
import {AuthSettingsFirebaseRef} from './auth-settings';

export type AuthPermissionKey = string

export const AuthPermissionsFirebaseRef = function (db: firebase.database.Database) {
  return AuthSettingsFirebaseRef(db).child('permissions')
}

export interface AuthPermissionDm {
  $key?: AuthPermissionKey
  createdMils?: number
  description?: string
  editedMils?: number
  orderIndex?: number
}
