import {EventEmitter, Injectable} from '@angular/core'
import {ObjMap, ObjMapUtil, OneToManyReferenceMap} from '@tangential/core'
import {FirebaseProvider, FireBlanket} from '@tangential/firebase-util'
import * as firebase from 'firebase/app'
import {Observable} from 'rxjs/Observable'
import {Subscription} from 'rxjs/Subscription'
//noinspection TypeScriptPreferShortImport
import {AuthPermission} from '../../media-type/auth/auth-permission'
import {AuthRole} from '../../media-type/auth/auth-role'
import {AuthUser} from '../../media-type/auth/auth-user'
//noinspection TypeScriptPreferShortImport
import {FirebasePermissionService} from '../permission/firebase-permission-service'
//noinspection TypeScriptPreferShortImport
import {PermissionService} from '../permission/permission-service'
import {FirebaseRoleService} from '../role/firebase-role-service'
import {RoleService} from '../role/role-service'
import {UserService} from './user-service'
import Reference = firebase.database.Reference;
import DataSnapshot = firebase.database.DataSnapshot;


@Injectable()
export class FirebaseUserService implements UserService {
  valueRemoved$: EventEmitter<string> = new EventEmitter<string>(true)

  private path: string = '/auth/subjects'
  private userGrantedPermissionsPath: string = '/auth/subjectGrantedPermissions'
  private userEffectivePermissionsPath: string = '/auth/ep'
  private userRolesMappingPath = '/auth/subjectRoles'

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

    const db = fb.app.database()
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
    if (snap && snap.exists()) {
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
          const usersWithRemovedPerm = Object.keys(userToPermission).filter((userKey) => {
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
        const usersWithRemovedRole = Object.keys(userToRoles).filter((key) => {
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
    const cRef = this.ref.child(childKey)
    return FireBlanket.value(cRef).then(this.snapToValue)
  }

  values(): Observable<AuthUser[]> {
    return FireBlanket.awaitValue$(this.ref).map(this.snapMapToValue)
  }

  valuesOnce(): Promise<AuthPermission[]> {
    return FireBlanket.value(this.ref).then(this.snapMapToValue)

  }

  create(child: AuthUser): Promise<void> {
    const cRef = this.ref.child(child.$key)
    return FireBlanket.set(cRef, child.toJson(false))

  }

  update(child: AuthUser): Promise<void> {
    const cRef = this.ref.child(child.$key)
    return FireBlanket.set(cRef, child.toJson(false))
  }

  remove(childKey: string): Promise<void> {
    const cRef = this.ref.child(childKey)
    return FireBlanket.remove(cRef).then(() => {
      this.valueRemoved$.next(childKey)
    })
  }


  userPermissionsFromUserRolesMapping = (snap: DataSnapshot): Promise<ObjMap<AuthPermission>> => {
    const roleKeys = snap.exists() ? snap.val() : {}
    const userRolePermissions: ObjMap<AuthPermission> = {}
    const promises = Object.keys(roleKeys || {}).map((roleKey) => {
      return this.roleService.getPermissionsForRole(roleKey).then((rolePermissions) => {
        ObjMapUtil.addAll(userRolePermissions, ObjMapUtil.fromKeyedEntityArray(rolePermissions))
      })
    })
    return Promise.all(promises).then(() => {
      return userRolePermissions
    })
  }

  getRolePermissionsForUser(user: AuthUser | string): Promise<ObjMap<AuthPermission>> {
    const userKey: string = AuthUser.guard(user) ? user.$key : user
    const userRolesRef = this.userRolesMappingRef.child(userKey)
    return FireBlanket.value(userRolesRef).then(this.userPermissionsFromUserRolesMapping)
  }

  grantEffectivePermission(user: AuthUser, permission: AuthPermission): Promise<void> {
    const userEffPermRef = this.userEffectivePermissionsRef.child(user.$key).child(permission.$key)
    return FireBlanket.set(userEffPermRef, true)
  }

  revokeEffectivePermission(user: AuthUser, permission: AuthPermission): Promise<void> {
    const userEffPermRef = this.userEffectivePermissionsRef.child(user.$key).child(permission.$key)
    return FireBlanket.remove(userEffPermRef)
  }

  grantPermission(user: AuthUser, permission: AuthPermission): Promise<void> {
    const userGrantedPermRef = this.userGrantedPermissionsRef.child(user.$key).child(permission.$key)
    return FireBlanket.set(userGrantedPermRef, true).then(() => {
      return this.grantEffectivePermission(user, permission)
    })
  }

  revokePermission(user: AuthUser | string, permission: AuthPermission | string): Promise<void> {
    const userKey: string = AuthUser.guard(user) ? user.$key : user
    const permissionKey: string = AuthPermission.guard(permission) ? permission.$key : permission

    const userGrantedPermRef = this.userGrantedPermissionsRef.child(userKey).child(permissionKey)
    return FireBlanket.remove(userGrantedPermRef).then(() => {
      return this.updateEffectivePermissionsForUser(userKey)
    })
  }

  updateEffectivePermissionsForUser(userKey: string): Promise<void> {
    return this.calculateEffectivePermissionsForUser(userKey).then((effectivePermissions) => {
      const userEffPermRef = this.userEffectivePermissionsRef.child(userKey)
      return FireBlanket.set(userEffPermRef, ObjMapUtil.toTruthMap(effectivePermissions))
    }).catch(reason => {
      console.error('FirebaseUserService', 'updateEffectivePermissionsForUser failed', reason)
      throw reason
    })
  }

  grantRole(user: AuthUser, role: AuthRole): Promise<void> {
    const userGrantedRoleRef = this.userRolesMappingRef.child(user.$key).child(role.$key)
    return FireBlanket.set(userGrantedRoleRef, true).then(() => {
      return this.updateEffectivePermissionsForUser(user.$key)
    })
  }

  revokeRole(user: AuthUser, role: AuthRole): Promise<void> {
    return this._revokeRole(user.$key, role.$key)
  }

  private _revokeRole(userKey: string, roleKey: string): Promise<void> {
    const userGrantedRoleRef = this.userRolesMappingRef.child(userKey).child(roleKey)
    return FireBlanket.remove(userGrantedRoleRef).then(() => {
      return this.updateEffectivePermissionsForUser(userKey)
    })
  }

  getRolesForUser(user: AuthUser): Promise<AuthRole[]> {
    const userGrantedRoleRef = this.userRolesMappingRef.child(user.$key)
    return FireBlanket.value(userGrantedRoleRef).then(snap => snap.val()).then((obj: ObjMap<boolean>) => {
      //noinspection JSMismatchedCollectionQueryUpdate
      const userRoles: AuthRole[] = []
      const promises: Promise<void>[] = []
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
    const userKey: string = AuthUser.guard(user) ? user.$key : user

    const userGrantedPermRef = this.userGrantedPermissionsRef.child(userKey)
    return FireBlanket.value(userGrantedPermRef).then(snap => snap.val()).then((obj: ObjMap<boolean>) => {
      //noinspection JSMismatchedCollectionQueryUpdate
      const grantedPermissions: AuthPermission[] = []
      const promises: Promise<void>[] = []
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
    const userKey: string = AuthUser.guard(user) ? user.$key : user

    let promise: Promise<AuthPermission[]>
    if (!user) {
      promise = new Promise((resolve) => resolve([]))
    } else {
      const userEffPermRef = this.userEffectivePermissionsRef.child(userKey)

      promise = FireBlanket.value(userEffPermRef).then(snap => snap.val()).then((obj: ObjMap<boolean>) => {
        //noinspection JSMismatchedCollectionQueryUpdate
        const effectivePermissions: AuthPermission[] = []
        const promises: Promise<void>[] = []
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

  removeUserRoles(...forUserKeys: string[]): Promise<void> {
    const promises: Promise<void>[] = forUserKeys.map((key) => FireBlanket.remove(this.userRolesMappingRef.child(key)))
    return Promise.all(promises).then(() => null)
  }


  destroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe())
  }
}
