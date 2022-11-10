import {Injectable} from '@angular/core';
import {MessageBus} from '@tangential/core';
import {FirebaseProvider, FireBlanket} from '@tangential/firebase-util';
import * as firebase from 'firebase'
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators'
import {Auth, AuthTransform} from '../../media-type/cdm/auth';
//noinspection TypeScriptPreferShortImport
import {AuthPermission, AuthPermissionTransform} from '../../media-type/cdm/auth-permission';
//noinspection TypeScriptPreferShortImport
import {AuthRole, AuthRoleTransform} from '../../media-type/cdm/auth-role';
//noinspection TypeScriptPreferShortImport
import {AuthSettings, AuthSettingsTransform} from '../../media-type/cdm/auth-settings';
//noinspection TypeScriptPreferShortImport
import {AuthUser, AuthUserTransform} from '../../media-type/cdm/auth-user';
//noinspection TypeScriptPreferShortImport
import {AuthPermissionKey, AuthPermissionsFirebaseRef} from '../../media-type/doc-model/auth-permission';
//noinspection TypeScriptPreferShortImport
import {AuthRoleKey, AuthRolesFirebaseRef} from '../../media-type/doc-model/auth-role';
//noinspection TypeScriptPreferShortImport
import {AuthSettingsDm} from '../../media-type/doc-model/auth-settings';
//noinspection TypeScriptPreferShortImport
import {AuthUserKey, AuthUsersFirebaseRef} from '../../media-type/doc-model/auth-user';
//noinspection TypeScriptPreferShortImport
import {AuthSettingsService} from '../settings-service/settings-service';
import {AdminService} from './admin-service';


@Injectable()
export class FirebaseAdminService extends AdminService {

  protected db: firebase.database.Database

  constructor(private bus: MessageBus,
              protected fb: FirebaseProvider,
              protected authSettingsService: AuthSettingsService) {
    super(authSettingsService, fb)
    this.db = this.fb.app.database()
  }

  public auth$(): Observable<Auth> {
    const ref = this.db.ref('/auth')
    return FireBlanket.awaitValue$(ref).pipe(
      map(snap => snap.val()),
      map(dm => AuthTransform.fromDocModel(dm)))
  }

  addPermission(newPermission: AuthPermission): Promise<void> {
    const cRef = AuthPermissionsFirebaseRef(this.db).child(newPermission.$key)
    const model = AuthPermissionTransform.toDocModel(newPermission)
    return FireBlanket.set(cRef, FireBlanket.util.clean(model))
  }


  updatePermission(permission: AuthPermission): Promise<void> {
    const cRef = AuthPermissionsFirebaseRef(this.db).child(permission.$key)
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
    const cRef = AuthPermissionsFirebaseRef(this.db).child(permissionKey)
    return FireBlanket.remove(cRef)
  }


  addRole(role: AuthRole): Promise<void> {
    const cRef = AuthRolesFirebaseRef(this.db).child(role.$key)
    const roleDm = AuthRoleTransform.toDocModel(role)
    return FireBlanket.set(cRef, FireBlanket.util.clean(roleDm))
  }

  updateRole(role: AuthRole): Promise<void> {
    const cRef = AuthRolesFirebaseRef(this.db).child(role.$key)
    const roleDm = AuthRoleTransform.toDocModel(role)
    return FireBlanket.update(cRef, FireBlanket.util.clean(roleDm))
  }

  removeRole(key: AuthRoleKey): Promise<void> {
    const cRef = AuthRolesFirebaseRef(this.db).child(key)
    return FireBlanket.remove(cRef)
  }


  addUser(user: AuthUser): Promise<void> {
    const cRef = AuthUsersFirebaseRef(this.db).child(user.$key)
    let userDm = AuthUserTransform.toDocModel(user)
    return FireBlanket.set(cRef, FireBlanket.util.clean(userDm))
  }

  updateUser(user: AuthUser): Promise<void> {
    const cRef = AuthUsersFirebaseRef(this.db).child(user.$key)
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
