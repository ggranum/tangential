import {AuthPermission, AuthRole, AuthUser} from "@tangential/media-types";
import {Observable, Subscription} from "rxjs";
import {EventEmitter, Injectable} from "@angular/core";
import {ObjMap, ObjMapUtil, OneToManyReferenceMap} from "@tangential/common";
import {FirebaseProvider, FireBlanket} from "@tangential/firebase-util";
//noinspection TypeScriptPreferShortImport
import {PermissionService} from "../permission/permission-service";
import {RoleService} from "../role/role-service";
import {UserService} from "./user-service";
//noinspection TypeScriptPreferShortImport
import {FirebasePermissionService} from "../permission/firebase-permission-service";
import {FirebaseRoleService} from "../role/firebase-role-service";
import * as firebase from "firebase/app";
import Reference = firebase.database.Reference;
import DataSnapshot = firebase.database.DataSnapshot;


@Injectable()
export class FirebaseUserService implements UserService {
  valueRemoved$: EventEmitter<string> = new EventEmitter<string>(true)

  private path: string = "/auth/users"
  private userGrantedPermissionsPath: string = "/auth/user_granted_permissions"
  private userEffectivePermissionsPath: string = "/auth/user_effective_permissions"
  private userRolesMappingPath = "/auth/user_roles"

  private ref: Reference
  private userGrantedPermissionsRef: Reference
  private userEffectivePermissionsRef: Reference
  private userRolesMappingRef: Reference

  private permissionService: FirebasePermissionService
  private roleService: FirebaseRoleService

  private subscriptions: Subscription[] = []

  constructor(private fb: FirebaseProvider, permService: PermissionService, roleService: RoleService) {
    this.permissionService = <FirebasePermissionService>permService
    this.roleService = <FirebaseRoleService>roleService

    let db = fb.app.database()
    this.ref = db.ref(this.path)
    this.userGrantedPermissionsRef = db.ref(this.userGrantedPermissionsPath)
    this.userEffectivePermissionsRef = db.ref(this.userEffectivePermissionsPath)
    this.userRolesMappingRef = db.ref(this.userRolesMappingPath)

    this.engagePermissionsSynchronization()
  }

  private snapMapToValue = (snap: DataSnapshot): AuthUser[] => {
    let result: AuthUser[] = []
    if (snap.exists()) {
      result = ObjMapUtil.toKeyedEntityArray(snap.val()).map(permJson => {
        return new AuthUser(permJson)
      })
    }
    return result
  }

  private snapToValue = (snap: DataSnapshot): AuthUser => {
    let result: AuthUser
    if (snap.exists()) {
      result = new AuthUser(snap.val(), snap.key)
    }
    return result
  }


  engagePermissionsSynchronization() {
    this.subscriptions.push(
      this.permissionService.valueRemoved$.subscribe((permKey: string) => {
        this.removePermission(permKey).catch((e) => {
          console.log('FirebaseUserService', 'error removing permission', e)
          throw e
        })

      }))

    this.subscriptions.push(
      this.roleService.valueRemoved$.subscribe((roleKey: string) => {
        this.removeRole(roleKey).catch((e) => {
          console.log('FirebaseUserService', 'error removing user', e)
          throw e
        })
      }))
  }

  removePermission(permKey: string): Promise<void> {
    return FireBlanket.value(this.userGrantedPermissionsRef)
      .then(snap => snap.val())
      .then((userToPermission): void => {
        if (userToPermission) {
          let usersWithRemovedPerm = Object.keys(userToPermission).filter((userKey) => {
            return !!userToPermission[userKey][permKey]
          })
          usersWithRemovedPerm.forEach((ruleKey: string) => {
            //noinspection JSIgnoredPromiseFromCall
            this.revokePermission(ruleKey, permKey).catch((reason) => {
              console.error('FirebaseUserService', 'Revoke permission failed.', reason)
              throw reason
            })
          })
        }
      }).catch((reason) => {
        console.error('FirebaseUserService', 'engagePermissionSynchronization', reason)
      })
  }

  removeRole(roleKey: string): Promise<void> {
    return FireBlanket.value(this.userRolesMappingRef).then(snap => snap.val()).then((userToRoles): any => {
      if (userToRoles) {
        let usersWithRemovedRole = Object.keys(userToRoles).filter((key) => {
          return !!userToRoles[key][roleKey]
        })
        usersWithRemovedRole.forEach((ruleKey: string) => {
          //noinspection JSIgnoredPromiseFromCall
          this._revokeRole(ruleKey, roleKey).catch((reason) => {
            console.error('FirebaseUserService', 'Revoke role failed.', reason)
            throw reason
          })
        })
      }
    }).catch((reason) => {
      console.error('FirebaseUserService', 'engageRoleSynchronization', reason)
    })
  }


  value(childKey: string): Promise<AuthUser> {
    let cRef = this.ref.child(childKey)
    return FireBlanket.value(cRef).then(this.snapToValue)
  }

  values(): Observable<AuthUser[]> {
    return FireBlanket.value$(this.ref).map(this.snapMapToValue)
  }

  valuesOnce(): Promise<AuthPermission[]> {
    return FireBlanket.value(this.ref).then(this.snapMapToValue)

  }

  create(child: AuthUser): Promise<AuthUser> {
    let cRef = this.ref.child(child.$key)
    return FireBlanket.set(cRef, child.toJson(false)).then(() => child)

  }

  update(child: AuthUser): Promise<void> {
    let cRef = this.ref.child(child.$key)
    return FireBlanket.set(cRef, child.toJson(false)).then()
  }

  remove(childKey: string): Promise<string> {
    let cRef = this.ref.child(childKey)
    return FireBlanket.remove(cRef).then(() => {
      this.valueRemoved$.next(childKey)
      return childKey
    })
  }


  userPermissionsFromUserRolesMapping = (snap: DataSnapshot): Promise<ObjMap<AuthPermission>> => {
    let roleKeys = snap.exists() ? snap.val() : {}
    let userRolePermissions: ObjMap<AuthPermission> = {}
    let promises = Object.keys(roleKeys || {}).map((roleKey) => {
      return this.roleService.getPermissionsForRole(roleKey).then((rolePermissions) => {
        ObjMapUtil.addAll(userRolePermissions, ObjMapUtil.fromKeyedEntityArray(rolePermissions))
      })
    })
    return Promise.all(promises).then(() => {
      return userRolePermissions
    })
  }

  getRolePermissionsForUser(user: AuthUser | string): Promise<ObjMap<AuthPermission>> {
    let userKey: string = AuthUser.guard(user) ? user.$key : user
    let userRolesRef = this.userRolesMappingRef.child(userKey)
    return FireBlanket.value(userRolesRef).then(this.userPermissionsFromUserRolesMapping)
  }

  grantEffectivePermission(user: AuthUser, permission: AuthPermission): Promise<void> {
    let userEffPermRef = this.userEffectivePermissionsRef.child(user.$key).child(permission.$key)
    return FireBlanket.set(userEffPermRef, true).then()
  }

  revokeEffectivePermission(user: AuthUser, permission: AuthPermission): Promise<void> {
    let userEffPermRef = this.userEffectivePermissionsRef.child(user.$key).child(permission.$key)
    return FireBlanket.remove(userEffPermRef).then()
  }

  grantPermission(user: AuthUser, permission: AuthPermission): Promise<void> {
    let userGrantedPermRef = this.userGrantedPermissionsRef.child(user.$key).child(permission.$key)
    return FireBlanket.set(userGrantedPermRef, true).then(() => {
      return this.grantEffectivePermission(user, permission)
    })
  }

  revokePermission(user: AuthUser | string, permission: AuthPermission | string): Promise<void> {
    let userKey: string = AuthUser.guard(user) ? user.$key : user
    let permissionKey: string = AuthPermission.guard(permission) ? permission.$key : permission

    let userGrantedPermRef = this.userGrantedPermissionsRef.child(userKey).child(permissionKey)
    return FireBlanket.remove(userGrantedPermRef).then(() => {
      return this.updateEffectivePermissionsForUser(userKey)
    })
  }

  updateEffectivePermissionsForUser(userKey: string): Promise<void> {
    return this.calculateEffectivePermissionsForUser(userKey).then((effectivePermissions) => {
      let userEffPermRef = this.userEffectivePermissionsRef.child(userKey)
      return FireBlanket.set(userEffPermRef, ObjMapUtil.toTruthMap(effectivePermissions))
    }).catch(reason => {
      console.error('FirebaseUserService', 'updateEffectivePermissionsForUser failed', reason)
      throw reason
    })
  }

  grantRole(user: AuthUser, role: AuthRole): Promise<void> {
    let userGrantedRoleRef = this.userRolesMappingRef.child(user.$key).child(role.$key)
    return FireBlanket.set(userGrantedRoleRef, true).then(() => {
      return this.updateEffectivePermissionsForUser(user.$key)
    })
  }

  revokeRole(user: AuthUser, role: AuthRole): Promise<void> {
    return this._revokeRole(user.$key, role.$key)
  }

  private _revokeRole(userKey: string, roleKey: string): Promise<void> {
    let userGrantedRoleRef = this.userRolesMappingRef.child(userKey).child(roleKey)
    return FireBlanket.remove(userGrantedRoleRef).then(() => {
      return this.updateEffectivePermissionsForUser(userKey)
    })
  }

  getRolesForUser(user: AuthUser): Promise<AuthRole[]> {
    let userGrantedRoleRef = this.userRolesMappingRef.child(user.$key)
    return FireBlanket.value(userGrantedRoleRef).then(snap => snap.val()).then((obj: ObjMap<boolean>) => {
      //noinspection JSMismatchedCollectionQueryUpdate
      let userRoles: AuthRole[] = []
      let promises: Promise<void>[] = []
      obj = obj || {}
      Object.keys(obj || {}).forEach(key => {
        promises.push(this.roleService.value(key).then((role: AuthRole) => {
          if (role) {
            userRoles.push(role)
          }
        }))
      })
      return Promise.all(promises).then(() => {
        return userRoles
      })
    })
  }

  getGrantedPermissionsForUser(user: AuthUser | string): Promise<AuthPermission[]> {
    let userKey: string = AuthUser.guard(user) ? user.$key : user

    let userGrantedPermRef = this.userGrantedPermissionsRef.child(userKey)
    return FireBlanket.value(userGrantedPermRef).then(snap => snap.val()).then((obj: ObjMap<boolean>) => {
      //noinspection JSMismatchedCollectionQueryUpdate
      let grantedPermissions: AuthPermission[] = []
      let promises: Promise<void>[] = []
      Object.keys(obj || {}).forEach(key => {
        promises.push(this.permissionService.value(key).then((permission: AuthPermission) => {
          if (permission) {
            grantedPermissions.push(permission)
          }
        }))
      })
      return Promise.all(promises).then(() => {
        return grantedPermissions
      })
    })
  }

  calculateEffectivePermissionsForUser(userKey: string): Promise<ObjMap<AuthPermission>> {
    return this.getRolePermissionsForUser(userKey).then((effectivePermissions: ObjMap<AuthPermission>) => {
      return this.getGrantedPermissionsForUser(userKey).then((grantedPermissions) => {
        return ObjMapUtil.addAll(effectivePermissions, ObjMapUtil.fromKeyedEntityArray(grantedPermissions))
      })
    }).catch(reason => console.error('FirebaseUserService', 'calculateEffectivePermissionsForUser failed', reason))
  }

  getEffectivePermissionsForUser(user: AuthUser | string): Promise<AuthPermission[]> {
    let userKey: string = AuthUser.guard(user) ? user.$key : user

    let promise: Promise<AuthPermission[]>
    if (!user) {
      promise = new Promise((resolve) => resolve([]))
    } else {
      let userEffPermRef = this.userEffectivePermissionsRef.child(userKey)

      promise = FireBlanket.value(userEffPermRef).then(snap => snap.val()).then((obj: ObjMap<boolean>) => {
        //noinspection JSMismatchedCollectionQueryUpdate
        let effectivePermissions: AuthPermission[] = []
        let promises: Promise<void>[] = []
        Object.keys(obj || {}).forEach(key => {
          promises.push(this.permissionService.value(key).then((permission: AuthPermission) => {
            if (permission) {
              effectivePermissions.push(permission)
            }
          }))
        })
        return Promise.all(promises).then(() => {
          return effectivePermissions
        })
      })
    }
    return promise
  }

  getUserRoles(): Promise<OneToManyReferenceMap> {
    return FireBlanket.value(this.userRolesMappingRef).then(snap => snap.val())
  }

  removeUserRoles(...forUserKeys: string[]): Promise<string[]> {
    let promises = forUserKeys.map((key) => FireBlanket.remove(this.userRolesMappingRef.child(key)))
    return Promise.all(promises)
  }


  destroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe())
  }
}
