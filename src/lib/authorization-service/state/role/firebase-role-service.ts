import {EventEmitter, Injectable} from '@angular/core'
import {AuthPermission, AuthRole} from '@tangential/authorization-service'
import {MapEntry, ObjectUtil, ObjMap, ObjMapUtil} from '@tangential/core'

import {FirebaseProvider, FireBlanket} from '@tangential/firebase-util'
import * as firebase from 'firebase/app'
import {Observable} from 'rxjs/Observable'
//noinspection TypeScriptPreferShortImport
import {FirebasePermissionService} from '../permission/firebase-permission-service'
//noinspection TypeScriptPreferShortImport
import {PermissionService} from '../permission/permission-service'

import {RoleService} from './role-service'
import DataSnapshot = firebase.database.DataSnapshot;


@Injectable()
export class FirebaseRoleService implements RoleService {
  valueRemoved$: EventEmitter<string> = new EventEmitter<string>(true)


  private path: string = '/auth/settings/roles'
  private rolePermissionsPath: string = '/auth/settings/rolePermissions'
  private db: firebase.database.Database
  private ref: firebase.database.Reference
  private roleToPermissionsRef: firebase.database.Reference

  private permissionService: FirebasePermissionService

  constructor(private fb: FirebaseProvider, private permService: PermissionService) {
    // super('/auth/roles', fb.app.database(), (json: any, key: string) => {
    //   return json ? new AuthRole(Object.assign({}, json, {$key: key})) : null
    // }, _zone)
    this.db = fb.app.database()
    this.ref = this.db.ref(this.path)
    this.roleToPermissionsRef = this.db.ref(this.rolePermissionsPath)
    this.permissionService = <FirebasePermissionService>permService
    this.engagePermissionsSynchronization()
  }

  private snapMapToValue = (snap: DataSnapshot): AuthRole[] => {
    let result: AuthRole[] = []
    if (snap.exists()) {
      result = ObjMapUtil.toKeyedEntityArray(snap.val()).map(permJson => {
        return new AuthRole(permJson)
      })
    }
    return result
  }

  private snapToValue = (snap: DataSnapshot): AuthRole => {
    let result: AuthRole
    if (snap.exists()) {
      result = new AuthRole(snap.val(), snap.key)
    }
    return result
  }


  engagePermissionsSynchronization() {
    this.permissionService.valueRemoved$.subscribe((permissionKey: string) => {
      this.removePermission(permissionKey).catch((e) => {
        console.log('FirebaseRoleService', 'error removing syncronized permission', e)
        throw e
      })
    })
  }

  value(childKey: string): Promise<AuthRole> {
    const cRef = this.ref.child(childKey)
    return FireBlanket.value(cRef).then(this.snapToValue)
  }

  roles$(): Observable<AuthRole[]> {
    return FireBlanket.awaitValue$(this.ref).map(this.snapMapToValue)
  }

  valuesOnce(): Promise<AuthPermission[]> {
    return FireBlanket.value(this.ref).then(this.snapMapToValue)

  }

  create(child: AuthRole): Promise<void> {
    const cRef = this.ref.child(child.$key)
    return FireBlanket.set(cRef, child.toJson(false))

  }

  update(child: AuthRole): Promise<void> {
    const cRef = this.ref.child(child.$key)
    return FireBlanket.set(cRef, child.toJson(false))
  }

  remove(childKey: string): Promise<void> {
    const cRef = this.ref.child(childKey)
    return FireBlanket.remove(cRef).then(() => {
      this.valueRemoved$.next(childKey)
    })
  }


  removePermission(permissionKey: string): Promise<void> {
    return FireBlanket.value(this.roleToPermissionsRef).then((snap) => {
      const rolesWithPermission: string[] = []
      if (snap.exists()) {
        const map = snap.val()
        ObjectUtil.entries(map).forEach((entry: MapEntry<ObjMap<boolean>>) => {
          if (entry.value[permissionKey] === true) {
            rolesWithPermission.push(entry.key)
          }
        })
      }
      const promises: Promise<void>[] = []
      rolesWithPermission.forEach((roleKey) => {
        promises.push(this.revokePermission(roleKey, permissionKey))
      })
      return Promise.all(promises)
    }).then(() => null)
  }

  grantPermission(role: AuthRole | string, permission: AuthPermission | string): Promise<void> {
    const roleKey: string = AuthRole.guard(role) ? role.$key : role
    const permissionKey: string = AuthPermission.guard(permission) ? permission.$key : permission
    const pRef = this.roleToPermissionsRef.child(roleKey).child(permissionKey)
    return FireBlanket.set(pRef, true)
  }

  revokePermission(role: AuthRole | string, permission: AuthPermission | string): Promise<void> {
    const roleKey: string = AuthRole.guard(role) ? role.$key : role
    const permissionKey: string = AuthPermission.guard(permission) ? permission.$key : permission
    const pRef = this.roleToPermissionsRef.child(roleKey).child(permissionKey)
    return FireBlanket.remove(pRef)
  }

  getPermissionsForRole$(role: AuthRole | string): Observable<AuthPermission[]> {
    const roleKey: string = AuthRole.guard(role) ? role.$key : role
    const roleRef = this.roleToPermissionsRef.child(roleKey)
    return FireBlanket.awaitValue$(roleRef).map(snap => snap.val()).flatMap((obj: ObjMap<boolean>) => {
      //noinspection JSMismatchedCollectionQueryUpdate
      const rolePerms: AuthPermission[] = []
      const promises: Promise<void>[] = []
      Object.keys(obj || {}).forEach(key => {
        promises.push(this.permissionService.value(key).then((perm: AuthPermission) => {
          if (perm) {
            rolePerms.push(perm)
          }
        }))
      })
      return Observable.from(Promise.all(promises).then(() => {
        return rolePerms
      }))
    })
  }


  getPermissionsForRole(role: AuthRole | string): Promise<AuthPermission[]> {
    return this.getPermissionsForRole$(role).take(1).toPromise()
  }


  destroy(): void {
  }

}
