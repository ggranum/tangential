import {Database} from '@firebase/database'
import {AuthSettingsFirebaseRef} from './auth-settings';
import {child} from 'firebase/database'

export type AuthPermissionKey = string

export const AuthPermissionsFirebaseRef = function (db: Database) {
  return child(AuthSettingsFirebaseRef(db), 'permissions')
}

export interface AuthPermissionDm {
  $key?: AuthPermissionKey
  createdMils?: number
  description?: string
  editedMils?: number
  orderIndex?: number
}
