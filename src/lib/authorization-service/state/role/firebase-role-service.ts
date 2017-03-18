import {AuthPermission, AuthRole} from "@tangential/media-types";
import {BehaviorSubject, Observable} from "rxjs";
import {EventEmitter, Injectable} from "@angular/core";
import {MapEntry, ObjectUtil, ObjMap, ObjMapUtil} from "@tangential/common";

import {FirebaseProvider, FireBlanket} from "@tangential/firebase-util";

import {RoleService} from "./role-service";
//noinspection TypeScriptPreferShortImport
import {PermissionService} from "../permission/permission-service";
//noinspection TypeScriptPreferShortImport
import {FirebasePermissionService} from "../permission/firebase-permission-service";
import * as firebase from "firebase/app";
import DataSnapshot = firebase.database.DataSnapshot;



@Injectable()
export class FirebaseRoleService implements RoleService {
  valueRemoved$: EventEmitter<string> = new EventEmitter<string>(true)


  private path: string = "/auth/roles"
  private rolePermissionsPath: string = "/auth/role_permissions"
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
      this.removePermission(permissionKey).catch((e) =>{
        console.log('FirebaseRoleService', 'error removing syncronized permission', e)
        throw e
      })
    })
  }

  value(childKey: string): Promise<AuthRole> {
    let cRef = this.ref.child(childKey)
    return FireBlanket.value(cRef).then(this.snapToValue)
  }

  values(): Observable<AuthRole[]> {
    return FireBlanket.value$(this.ref).map(this.snapMapToValue)
  }

  valuesOnce(): Promise<AuthPermission[]> {
    return FireBlanket.value(this.ref).then(this.snapMapToValue)

  }

  create(child: AuthRole): Promise<AuthRole> {
    let cRef = this.ref.child(child.$key)
    return FireBlanket.set(cRef, child.toJson(false)).then(() => child)

  }

  update(child: AuthRole): Promise<AuthRole> {
    let cRef = this.ref.child(child.$key)
    return FireBlanket.set(cRef, child.toJson(false)).then(() => child)
  }

  remove(childKey: string): Promise<string> {
    let cRef = this.ref.child(childKey)
    return FireBlanket.remove(cRef).then(() => {
      this.valueRemoved$.next(childKey)
      return childKey
    })
  }


  removePermission(permissionKey: string): Promise<void> {
    return FireBlanket.value(this.roleToPermissionsRef).then((snap) => {
      let rolesWithPermission: string[] = []
      if (snap.exists()) {
        let map = snap.val()
        ObjectUtil.entries(map).forEach((entry: MapEntry<ObjMap<boolean>>) => {
          if (entry.value[permissionKey] === true) {
            rolesWithPermission.push(entry.key)
          }
        })
      }
      let promises: Promise<void>[] = []
      rolesWithPermission.forEach((roleKey) => {
        promises.push(this.revokePermission(roleKey, permissionKey))
      })
      return Promise.all(promises)
    }).then(() => null)
  }

  grantPermission(role: AuthRole | string, permission: AuthPermission | string): Promise<void> {
    let roleKey: string = AuthRole.guard(role) ? role.$key : role
    let permissionKey: string = AuthPermission.guard(permission) ? permission.$key : permission
    let pRef = this.roleToPermissionsRef.child(roleKey).child(permissionKey)
    return FireBlanket.set(pRef, true)
  }

  revokePermission(role: AuthRole | string, permission: AuthPermission | string): Promise<void> {
    let roleKey: string = AuthRole.guard(role) ? role.$key : role
    let permissionKey: string = AuthPermission.guard(permission) ? permission.$key : permission
    let pRef = this.roleToPermissionsRef.child(roleKey).child(permissionKey)
    return FireBlanket.remove(pRef)
  }

  getPermissionsForRole$(role: AuthRole | string): Observable<AuthPermission[]> {
    let roleKey: string = AuthRole.guard(role) ? role.$key : role
    let roleRef = this.roleToPermissionsRef.child(roleKey)
    return FireBlanket.value$(roleRef).map(snap => snap.val()).flatMap((obj: ObjMap<boolean>) => {
      //noinspection JSMismatchedCollectionQueryUpdate
      let rolePerms: AuthPermission[] = []
      let promises: Promise<void>[] = []
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
