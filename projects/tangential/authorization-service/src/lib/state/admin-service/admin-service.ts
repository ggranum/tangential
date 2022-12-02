import {Injectable} from '@angular/core';

import {Database} from '@firebase/database'
import {child, getDatabase} from 'firebase/database'


import {Observable} from 'rxjs';
import {first} from 'rxjs/operators'
//noinspection ES6PreferShortImport
import {Auth} from '../../media-type/cdm/auth';
//noinspection ES6PreferShortImport
import {AuthPermission} from '../../media-type/cdm/auth-permission';
//noinspection ES6PreferShortImport
import {AuthPermissionKey} from '../../media-type/doc-model/auth-permission';
//noinspection ES6PreferShortImport
import {AuthRoleKey, AuthRolePermissionsFirebaseRef} from '../../media-type/doc-model/auth-role';
//noinspection ES6PreferShortImport
import {AuthRole} from '../../media-type/cdm/auth-role';
//noinspection ES6PreferShortImport
import {AuthUser} from '../../media-type/cdm/auth-user';
import {FirebaseProvider, FireBlanket} from '@tangential/firebase-util';
//noinspection ES6PreferShortImport
import {AuthSettings} from '../../media-type/cdm/auth-settings';
//noinspection ES6PreferShortImport
import {AuthUserKey} from '../../media-type/doc-model/auth-user';
//noinspection ES6PreferShortImport
import {AuthSettingsService} from '../settings-service/settings-service';


@Injectable()
export abstract class AdminService {

  protected db: Database

  constructor(protected authSettingsService:AuthSettingsService,
              protected fb: FirebaseProvider) {
    this.db = getDatabase(fb.app)

  }

  /**
   * Use extremely rarely. This loads the entire Auth document, including *all* users.
   */
  abstract auth$(): Observable<Auth>

  abstract addPermission(permission: AuthPermission):Promise<void>

  abstract removePermission(key: AuthPermissionKey):Promise<void>

  abstract updatePermission(permission: AuthPermission):Promise<void>

  abstract addRole(role: AuthRole): Promise<void>

  abstract updateRole(role: AuthRole): Promise<void>

  abstract removeRole(key: AuthRoleKey): Promise<void>




  /**
   * @todo ggranum: Add Firebase Function to watch for Add Permission on Role action for updating user effective permissions.
   * @param roleKey
   * @param permissionKey
   * @returns {Promise<void>}
   */
  grantPermissionOnRole(roleKey: AuthRoleKey, permissionKey: AuthPermissionKey): Promise<void> {
    this.authSettingsService.authSettings$().pipe(first()).toPromise().then((authSettings:AuthSettings) => {
      let role = authSettings.getRole(roleKey)
      let permission = authSettings.getPermission(permissionKey)
      role.permissions.push(permission)
      this.updateSettings(authSettings)
    })
    const pRef = child(AuthRolePermissionsFirebaseRef(this.db), roleKey + '/' + permissionKey)
    return FireBlanket.set(pRef, true)
  }

  /**
   * @todo ggranum: Add Firebase Function to watch for revoke Permission on Role action for updating user effective permissions.
   * @param roleKey
   * @param permissionKey
   * @returns {Promise<void>}
   */
  revokePermissionOnRole(roleKey: AuthRoleKey, permissionKey: AuthPermissionKey): Promise<void> {
    const pRef = child(AuthRolePermissionsFirebaseRef(this.db), roleKey + '/' + permissionKey)
    return FireBlanket.remove(pRef)
  }

  abstract addUser(entity: AuthUser): Promise<void>

  abstract updateUser(entity: AuthUser): Promise<void>

  abstract removeUser(entityKey: string): Promise<void>

  abstract grantPermissionOnUser(user: AuthUser, permission: AuthPermission): Promise<void>

  abstract revokePermissionOnUser(user: AuthUser, permission: AuthPermission): Promise<void>

  abstract grantRoleOnUser(user: AuthUser, role: AuthRole): Promise<void>

  abstract revokeRoleOnUser(key: AuthUserKey, role: AuthRoleKey): Promise<void>

  abstract updateSettings(authSettings: AuthSettings)
}
