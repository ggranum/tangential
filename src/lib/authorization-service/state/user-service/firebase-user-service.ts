import {Injectable} from '@angular/core'
import {MessageBus, ObjectUtil, ObjMap, ObjMapUtil} from '@tangential/core'
import {FirebaseProvider, FireBlanket} from '@tangential/firebase-util'
import * as firebase from 'firebase'
import {Observable} from 'rxjs'
import {first, map} from 'rxjs/operators';
//noinspection TypeScriptPreferShortImport
import {AuthPermission} from '../../media-type/cdm/auth-permission'
import {AuthRole} from '../../media-type/cdm/auth-role'
//noinspection TypeScriptPreferShortImport
import {AuthSettings, AuthSettingsTransform} from '../../media-type/cdm/auth-settings'
import {AuthUser, AuthUserTransform} from '../../media-type/cdm/auth-user'
import {AuthEffectivePermissionsRef, AuthGrantedPermissionsRef, AuthGrantedRolesRef} from '../../media-type/doc-model/auth'
//noinspection TypeScriptPreferShortImport
import {AuthRoleDm} from '../../media-type/doc-model/auth-role'
//noinspection TypeScriptPreferShortImport
import {AuthSettingsFirebaseRef} from '../../media-type/doc-model/auth-settings'
//noinspection TypeScriptPreferShortImport
import {AuthUserDm, AuthUserKey, AuthUsersFirebaseRef} from '../../media-type/doc-model/auth-user'
//noinspection TypeScriptPreferShortImport
import {AuthSettingsService} from '../settings-service/settings-service'
//noinspection TypeScriptPreferShortImport
import {UserService} from './user-service'
import DataSnapshot = firebase.database.DataSnapshot

import Reference = firebase.database.Reference


@Injectable()
export class FirebaseUserService implements UserService {


  userPermissionsFromUserRolesMapping = (snap: DataSnapshot): Promise<ObjMap<AuthPermission>> => {
    const roleKeys = snap.exists() ? snap.val() : {}
    return this.authSettingsService.authSettings$().pipe(first()).toPromise().then((authSettings: AuthSettings) => {
      return authSettings.permissionsForRoles(ObjectUtil.keys(roleKeys))
    })
  }
  private authSettingsRef: Reference
  private effectivePermissionsRef: Reference
  private grantedPermissionsRef: Reference
  private grantedRolesRef: Reference
  private ref: Reference
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

  constructor(private fb: FirebaseProvider, private bus: MessageBus, private authSettingsService: AuthSettingsService) {

    const db = fb.app.database()
    this.ref = AuthUsersFirebaseRef(db)
    this.authSettingsRef = AuthSettingsFirebaseRef(db)
    this.grantedPermissionsRef = AuthGrantedPermissionsRef(db)
    this.effectivePermissionsRef = AuthEffectivePermissionsRef(db)
    this.grantedRolesRef = AuthGrantedRolesRef(db)
  }

  getRolePermissionsFor(userKey: AuthUserKey): Promise<ObjMap<AuthPermission>> {
    const userRolesRef = this.grantedRolesRef.child(userKey)
    return FireBlanket.value(userRolesRef).then(this.userPermissionsFromUserRolesMapping)
  }

  getUser(key: AuthUserKey): Promise<AuthUser> {
    let effectivePermissions: ObjMap<AuthPermission>
    let grantedPermissions: ObjMap<AuthPermission>
    let grantedRoles: ObjMap<AuthRole>
    let authUser: AuthUser
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

  getUserFragment(key: AuthUserKey): Promise<AuthUser> {
    const cRef = this.ref.child(key)
    return FireBlanket.value(cRef).then(this.snapToValue)
      .then(dm => AuthUserTransform.fragmentFromDocModel(dm, dm ? dm.$key : key))
  }

  awaitUsers$(): Observable<AuthUserDm[]> {
    return FireBlanket.awaitValue$(this.ref).pipe(map(this.snapMapToValue))
  }

  effectivePermissionsFor(userKey: AuthUserKey): Promise<ObjMap<AuthPermission>> {
    return FireBlanket.awaitValue$(this.effectivePermissionsRef.child(userKey)).pipe(
      first()
    ).toPromise().then(snap => {
      return this.authSettings$().pipe(first()).toPromise().then(authSettings => {
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
    return FireBlanket.awaitValue$(this.grantedPermissionsRef.child(userKey)).pipe(
      first()
    ).toPromise().then(snap => {
      return this.authSettings$().pipe(first()).toPromise().then(authSettings => {
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
    return FireBlanket.awaitValue$(this.grantedRolesRef.child(userKey)).pipe(
      first()
    ).toPromise().then(snap => {
      return this.authSettings$().pipe(first()).toPromise().then(authSettings => {
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

  private authSettings$(): Observable<AuthSettings> {
    return FireBlanket.awaitValue$(this.authSettingsRef).pipe(
      map(snap => snap.val()),
      map(docModel => AuthSettingsTransform.fromDocModel(docModel)))
  }


}
