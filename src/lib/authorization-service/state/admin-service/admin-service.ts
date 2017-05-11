import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Auth} from '../../media-type/cdm/auth';
//noinspection TypeScriptPreferShortImport
import {AuthPermission} from '../../media-type/cdm/auth-permission';
//noinspection TypeScriptPreferShortImport
import {AuthPermissionKey} from '../../media-type/doc-model/auth-permission';
//noinspection TypeScriptPreferShortImport
import {AuthRoleKey, AuthRolePermissionsFirebaseRef} from '../../media-type/doc-model/auth-role';
//noinspection TypeScriptPreferShortImport
import {AuthRole} from '../../media-type/cdm/auth-role';
import {AuthUser} from '../../media-type/cdm/auth-user';
import {FirebaseProvider, FireBlanket} from '@tangential/firebase-util';
//noinspection TypeScriptPreferShortImport
import {AuthSettings} from '../../media-type/cdm/auth-settings';
//noinspection TypeScriptPreferShortImport
import {AuthUserKey} from '../../media-type/doc-model/auth-user';
//noinspection TypeScriptPreferShortImport
import {AuthSettingsService} from '../settings-service/settings-service';


@Injectable()
export abstract class AdminService {

  protected db: firebase.database.Database

  constructor(protected authSettingsService:AuthSettingsService,
              protected fb: FirebaseProvider) {
    this.db = fb.app.database()
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
    this.authSettingsService.authSettings$().first().toPromise().then((authSettings:AuthSettings) => {
      let role = authSettings.getRole(roleKey)
      let permission = authSettings.getPermission(permissionKey)
      role.permissions.push(permission)
      this.updateSettings(authSettings)
    })
    const pRef = AuthRolePermissionsFirebaseRef(this.db).child(roleKey).child(permissionKey)
    return FireBlanket.set(pRef, true)
  }

  /**
   * @todo ggranum: Add Firebase Function to watch for revoke Permission on Role action for updating user effective permissions.
   * @param roleKey
   * @param permissionKey
   * @returns {Promise<void>}
   */
  revokePermissionOnRole(roleKey: AuthRoleKey, permissionKey: AuthPermissionKey): Promise<void> {
    const pRef = AuthRolePermissionsFirebaseRef(this.db).child(roleKey).child(permissionKey)
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
