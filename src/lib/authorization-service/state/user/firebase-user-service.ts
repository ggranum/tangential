import {Injectable} from '@angular/core';
import {MessageBus, ObjectUtil, ObjMap, ObjMapUtil} from '@tangential/core';
import {FirebaseProvider, FireBlanket} from '@tangential/firebase-util';
import * as firebase from 'firebase/app';
import {Observable} from 'rxjs/Observable';
//noinspection TypeScriptPreferShortImport
import {AuthRoleDm} from '../../media-type/doc-model/auth-role';
//noinspection TypeScriptPreferShortImport
import {UserService} from './user-service';
//noinspection TypeScriptPreferShortImport
import {AuthUserDm, AuthUserKey, AuthUsersFirebaseRef} from '../../media-type/doc-model/auth-user';
import {AuthUser, AuthUserTransform} from '../../media-type/cdm/auth-user';
//noinspection TypeScriptPreferShortImport
import {AuthPermission} from '../../media-type/cdm/auth-permission';
import {AuthRole} from '../../media-type/cdm/auth-role';
//noinspection TypeScriptPreferShortImport
import {AuthSettingsFirebaseRef} from '../../media-type/doc-model/auth-settings';
import {AuthEffectivePermissionsRef, AuthGrantedPermissionsRef, AuthGrantedRolesRef} from '../../media-type/doc-model/auth';
//noinspection TypeScriptPreferShortImport
//noinspection TypeScriptPreferShortImport
import {AuthSettings, AuthSettingsTransform} from '../../media-type/cdm/auth-settings';
import {AuthSettingsService} from '../settings-service/settings-service';

import Reference = firebase.database.Reference;
import DataSnapshot = firebase.database.DataSnapshot;


@Injectable()
export class FirebaseUserService implements UserService {


  private ref: Reference
  private authSettingsRef: Reference
  private grantedPermissionsRef: Reference
  private effectivePermissionsRef: Reference
  private grantedRolesRef: Reference

  constructor(private fb: FirebaseProvider, private bus: MessageBus, private authSettingsService: AuthSettingsService) {

    const db = fb.app.database()
    this.ref = AuthUsersFirebaseRef(db)
    this.authSettingsRef = AuthSettingsFirebaseRef(db)
    this.grantedPermissionsRef = AuthGrantedPermissionsRef(db)
    this.effectivePermissionsRef = AuthEffectivePermissionsRef(db)
    this.grantedRolesRef = AuthGrantedRolesRef(db)
  }

  private snapMapToValue = (snap: DataSnapshot): AuthUserDm[] => {
    let result: AuthUserDm[] = []
    if (snap.exists()) {
      return ObjMapUtil.toKeyedEntityArray(snap.val())
    }
    return result
  }

  private snapToValue = (snap: DataSnapshot): AuthUserDm => {
    let result: AuthUserDm
    if (snap && snap.exists()) {
      result = Object.assign({}, {$key: snap.key}, snap.val())
    }
    return result
  }


  getUserFragment(key: AuthUserKey): Promise<AuthUser> {
    const cRef = this.ref.child(key)
    return FireBlanket.value(cRef).then(this.snapToValue)
      .then(dm => AuthUserTransform.fragmentFromDocModel(dm, dm ? dm.$key : key))
  }

  getUser(key: AuthUserKey): Promise<AuthUser> {
    let effectivePermissions: ObjMap<AuthPermission>
    let grantedPermissions: ObjMap<AuthPermission>
    let grantedRoles: ObjMap<AuthRole>
    let authUser:AuthUser
    return this.getUserFragment(key).then((userFragment: AuthUser) => {
      authUser = userFragment
      return Promise.all([
        this.effectivePermissionsFor(userFragment.$key).then(ep => effectivePermissions = ep),
        this.grantedPermissionsFor(userFragment.$key).then(gp => grantedPermissions = gp),
        this.grantedRolesFor(userFragment.$key).then(r => grantedRoles = r),
      ])
    }).then(() => {
        authUser.effectivePermissions = ObjMapUtil.toKeyedEntityArray(effectivePermissions)
        authUser.grantedPermissions = ObjMapUtil.toKeyedEntityArray(grantedPermissions)
        authUser.grantedRoles = ObjMapUtil.toKeyedEntityArray(grantedRoles)
        return authUser
      }
    )
  }

  awaitUsers$(): Observable<AuthUserDm[]> {
    return FireBlanket.awaitValue$(this.ref).map(this.snapMapToValue)
  }


  private authSettings$(): Observable<AuthSettings> {
    return FireBlanket.awaitValue$(this.authSettingsRef)
      .map(snap => snap.val())
      .map(docModel => AuthSettingsTransform.fromDocModel(docModel))
  }


  effectivePermissionsFor(userKey: AuthUserKey): Promise<ObjMap<AuthPermission>> {
    return FireBlanket.awaitValue$(this.effectivePermissionsRef.child(userKey))
      .first().toPromise().then(snap => {
        return this.authSettings$().first().toPromise().then(authSettings => {
          const v: ObjMap<AuthRoleDm> = snap.val()
          const permissions: ObjMap<AuthPermission> = {}
          let permissionSmap = authSettings.permissionsMap()
          ObjectUtil.entries(v).forEach(entry => {
            permissions[entry.key] = permissionSmap[entry.key]
          })
          return permissions
        })

      })
  }

  grantedPermissionsFor(userKey: AuthUserKey): Promise<ObjMap<AuthPermission>> {
    return FireBlanket.awaitValue$(this.grantedPermissionsRef.child(userKey))
      .first().toPromise().then(snap => {
        return this.authSettings$().first().toPromise().then(authSettings => {
          const v: ObjMap<AuthRoleDm> = snap.val()
          const permissions: ObjMap<AuthPermission> = {}
          let permissionSmap = authSettings.permissionsMap()
          ObjectUtil.entries(v).forEach(entry => {
            permissions[entry.key] = permissionSmap[entry.key]
          })
          return permissions
        })

      })
  }

  grantedRolesFor(userKey: AuthUserKey): Promise<ObjMap<AuthRole>> {
    return FireBlanket.awaitValue$(this.grantedRolesRef.child(userKey))
      .first().toPromise().then(snap => {
        return this.authSettings$().first().toPromise().then(authSettings => {
          const v: ObjMap<AuthRoleDm> = snap.val()
          const roles: ObjMap<AuthRole> = {}
          let roleMap = authSettings.rolesMap()
          ObjectUtil.entries(v).forEach(entry => {
            roles[entry.key] = roleMap[entry.key]
          })
          return roles
        })

      })
  }

  userPermissionsFromUserRolesMapping = (snap: DataSnapshot): Promise<ObjMap<AuthPermission>> => {
    const roleKeys = snap.exists() ? snap.val() : {}
    return this.authSettingsService.authSettings$().first().toPromise().then((authSettings: AuthSettings) => {
      return authSettings.permissionsForRoles(ObjectUtil.keys(roleKeys))
    })
  }


  getRolePermissionsFor(userKey: AuthUserKey): Promise<ObjMap<AuthPermission>> {
    const userRolesRef = this.grantedRolesRef.child(userKey)
    return FireBlanket.value(userRolesRef).then(this.userPermissionsFromUserRolesMapping)
  }


}
