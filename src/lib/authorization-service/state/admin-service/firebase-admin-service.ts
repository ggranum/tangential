import {Injectable} from '@angular/core';
import {Database} from '@firebase/database'
import {MessageBus} from '@tangential/core';

import {FirebaseProvider, FireBlanket} from '@tangential/firebase-util';
import {getDatabase, ref, get, child} from 'firebase/database'


import {Observable} from 'rxjs';
import {map} from 'rxjs/operators'
//noinspection ES6PreferShortImport
import {Auth, AuthTransform} from '../../media-type/cdm/auth';
//noinspection ES6PreferShortImport
import {AuthPermission, AuthPermissionTransform} from '../../media-type/cdm/auth-permission';
//noinspection ES6PreferShortImport
import {AuthRole, AuthRoleTransform} from '../../media-type/cdm/auth-role';
//noinspection ES6PreferShortImport
import {AuthSettings, AuthSettingsTransform} from '../../media-type/cdm/auth-settings';
//noinspection ES6PreferShortImport
import {AuthUser, AuthUserTransform} from '../../media-type/cdm/auth-user';
//noinspection ES6PreferShortImport
import {AuthPermissionKey, AuthPermissionsFirebaseRef} from '../../media-type/doc-model/auth-permission';
//noinspection ES6PreferShortImport
import {AuthRoleKey, AuthRolesFirebaseRef} from '../../media-type/doc-model/auth-role';
//noinspection ES6PreferShortImport
import {AuthSettingsDm} from '../../media-type/doc-model/auth-settings';
//noinspection ES6PreferShortImport
import {AuthUserKey, AuthUsersFirebaseRef} from '../../media-type/doc-model/auth-user';
//noinspection ES6PreferShortImport
import {AuthSettingsService} from '../settings-service/settings-service';

import {AdminService} from './admin-service';


@Injectable()
export class FirebaseAdminService extends AdminService {

  constructor(private bus: MessageBus,
              fb: FirebaseProvider,
              authSettingsService: AuthSettingsService) {
    super(authSettingsService, fb)
  }

  public auth$(): Observable<Auth> {
    const dRef = ref(this.db, '/auth')
    return FireBlanket.awaitValue$(dRef).pipe(
      map(snap => snap.val()),
      map(dm => AuthTransform.fromDocModel(dm)))
  }

  addPermission(newPermission: AuthPermission): Promise<void> {
    const cRef = child(AuthPermissionsFirebaseRef(this.db), newPermission.$key)
    const model = AuthPermissionTransform.toDocModel(newPermission)
    return FireBlanket.set(cRef, FireBlanket.util.clean(model))
  }


  updatePermission(permission: AuthPermission): Promise<void> {
    const cRef = child(AuthPermissionsFirebaseRef(this.db), permission.$key)
    const model = AuthPermissionTransform.toDocModel(permission)
    return FireBlanket.update(cRef, FireBlanket.util.clean(model))
  }

  /**
   * @todo ggranum: Add Firebase Function that watches for removed permissions and updates the Users table.
   * @todo ggranum: Remove these removed permissions from Roles.
   * @param permissionKey
   * @returns {Promise<void>}
   */
  removePermission(permissionKey: AuthPermissionKey): Promise<void> {
    const cRef = child(AuthPermissionsFirebaseRef(this.db), permissionKey)
    return FireBlanket.remove(cRef)
  }


  addRole(role: AuthRole): Promise<void> {
    const cRef = child(AuthRolesFirebaseRef(this.db), role.$key)
    const roleDm = AuthRoleTransform.toDocModel(role)
    return FireBlanket.set(cRef, FireBlanket.util.clean(roleDm))
  }

  updateRole(role: AuthRole): Promise<void> {
    const cRef = child(AuthRolesFirebaseRef(this.db), role.$key)
    const roleDm = AuthRoleTransform.toDocModel(role)
    return FireBlanket.update(cRef, FireBlanket.util.clean(roleDm))
  }

  removeRole(key: AuthRoleKey): Promise<void> {
    const cRef = child(AuthRolesFirebaseRef(this.db), key)
    return FireBlanket.remove(cRef)
  }


  addUser(user: AuthUser): Promise<void> {
    const cRef = child(AuthUsersFirebaseRef(this.db), user.$key)
    let userDm = AuthUserTransform.toDocModel(user)
    return FireBlanket.set(cRef, FireBlanket.util.clean(userDm))
  }

  updateUser(user: AuthUser): Promise<void> {
    const cRef = child(AuthUsersFirebaseRef(this.db), user.$key)
    let userDm = AuthUserTransform.toDocModel(user)
    return FireBlanket.update(cRef, FireBlanket.util.clean(userDm))
  }

  removeUser(entityKey: string): Promise<void> {
    return null;
  }

  grantPermissionOnUser(user: AuthUser, permission: AuthPermission): Promise<void> {
    return null;
  }

  revokePermissionOnUser(user: AuthUser, permission: AuthPermission): Promise<void> {
    return null;
  }

  grantRoleOnUser(user: AuthUser, role: AuthRole): Promise<void> {
    return null;
  }

  revokeRoleOnUser(userKey: AuthUserKey, role: AuthRoleKey): Promise<void> {
    return null;
  }

  updateSettings(authSettings: AuthSettings): Promise<void> {
    let authSettingsDm: AuthSettingsDm = AuthSettingsTransform.toDocModel(authSettings)


    return null
  }
}
