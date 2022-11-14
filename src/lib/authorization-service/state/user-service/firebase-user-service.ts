import {Injectable} from '@angular/core'
import {MessageBus, ObjectUtil, ObjMap, ObjMapUtil} from '@tangential/core'
import {FirebaseProvider, FireBlanket} from '@tangential/firebase-util'
import { DatabaseReference} from '@firebase/database'
import {child, DataSnapshot, getDatabase} from 'firebase/database'
import {firstValueFrom, Observable} from 'rxjs'
import {first, map} from 'rxjs/operators';
//noinspection ES6PreferShortImport
import {AuthPermission} from '../../media-type/cdm/auth-permission'
//noinspection ES6PreferShortImport
import {AuthRole} from '../../media-type/cdm/auth-role'
//noinspection ES6PreferShortImport
import {AuthSettings, AuthSettingsTransform} from '../../media-type/cdm/auth-settings'
//noinspection ES6PreferShortImport
import {AuthUser, AuthUserTransform} from '../../media-type/cdm/auth-user'
//noinspection ES6PreferShortImport
import {AuthEffectivePermissionsRef, AuthGrantedPermissionsRef, AuthGrantedRolesRef} from '../../media-type/doc-model/auth'
//noinspection ES6PreferShortImport
import {AuthRoleDm} from '../../media-type/doc-model/auth-role'
//noinspection ES6PreferShortImport
import {AuthSettingsFirebaseRef} from '../../media-type/doc-model/auth-settings'
//noinspection ES6PreferShortImport
import {AuthUserDm, AuthUserKey, AuthUsersFirebaseRef} from '../../media-type/doc-model/auth-user'
//noinspection ES6PreferShortImport
import {AuthSettingsService} from '../settings-service/settings-service'
//noinspection ES6PreferShortImport
import {UserService} from './user-service'




@Injectable()
export class FirebaseUserService implements UserService {


  userPermissionsFromUserRolesMapping = (snap: DataSnapshot): Promise<ObjMap<AuthPermission>> => {
    const roleKeys = snap.exists() ? snap.val() : {}
    return this.authSettingsService.authSettings$().pipe(first()).toPromise().then((authSettings: AuthSettings) => {
      return authSettings.permissionsForRoles(ObjectUtil.keys(roleKeys))
    })
  }
  private authSettingsRef: DatabaseReference
  private effectivePermissionsRef: DatabaseReference
  private grantedPermissionsRef: DatabaseReference
  private grantedRolesRef: DatabaseReference
  private ref: DatabaseReference
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

    const db = getDatabase(fb.app)
    this.ref = AuthUsersFirebaseRef(db)
    this.authSettingsRef = AuthSettingsFirebaseRef(db)
    this.grantedPermissionsRef = AuthGrantedPermissionsRef(db)
    this.effectivePermissionsRef = AuthEffectivePermissionsRef(db)
    this.grantedRolesRef = AuthGrantedRolesRef(db)
  }

  getRolePermissionsFor(userKey: AuthUserKey): Promise<ObjMap<AuthPermission>> {
    const userRolesRef = child(this.grantedRolesRef, userKey)
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
    const cRef = child(this.ref, key)
    return FireBlanket.value(cRef).then(this.snapToValue)
      .then(dm => AuthUserTransform.fragmentFromDocModel(dm, dm ? dm.$key : key))
  }

  awaitUsers$(): Observable<AuthUserDm[]> {
    return FireBlanket.awaitValue$(this.ref).pipe(map(this.snapMapToValue))
  }

  effectivePermissionsFor(userKey: AuthUserKey): Promise<ObjMap<AuthPermission>> {
    return firstValueFrom(FireBlanket.awaitValue$(child(this.effectivePermissionsRef, userKey))).then(snap => {
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
    return firstValueFrom(FireBlanket.awaitValue$(child(this.grantedPermissionsRef, userKey))).then(snap => {
      return firstValueFrom(this.authSettings$()).then(authSettings => {
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
    return firstValueFrom(FireBlanket.awaitValue$(child(this.grantedRolesRef, userKey))).then(snap => {
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
