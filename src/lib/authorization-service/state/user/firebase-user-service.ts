import {Injectable} from '@angular/core';
import {Logger, MessageBus, ObjectUtil, ObjMap, ObjMapUtil, OneToManyReferenceMap} from '@tangential/core';
import {FirebaseProvider, FireBlanket} from '@tangential/firebase-util';
import * as firebase from 'firebase/app';
import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';
//noinspection TypeScriptPreferShortImport
import {AuthRoleDm, AuthRoleKey} from '../../media-type/doc-model/auth-role';
//noinspection TypeScriptPreferShortImport
import {FirebasePermissionService} from '../permission/firebase-permission-service';
//noinspection TypeScriptPreferShortImport
import {PermissionService} from '../permission/permission-service';
import {FirebaseRoleService} from '../role/firebase-role-service';
import {RoleService} from '../role/role-service';
import {UserService} from './user-service';
//noinspection TypeScriptPreferShortImport
import {AuthUserDm, AuthUserKey, AuthUsersFirebaseRef} from '../../media-type/doc-model/auth-user';
import {AuthUser, AuthUserTransform} from '../../media-type/cdm/auth-user';
//noinspection TypeScriptPreferShortImport
import {AuthPermission} from '../../media-type/cdm/auth-permission';
import {AuthRole} from '../../media-type/cdm/auth-role';
import {AuthTransform} from '../../media-type/cdm/auth';

import Reference = firebase.database.Reference;
import DataSnapshot = firebase.database.DataSnapshot;
//noinspection TypeScriptPreferShortImport
import {AuthSettingsFirebaseRef} from '../../media-type/doc-model/auth-settings';
import {AuthEffectivePermissionsRef, AuthGrantedPermissionsRef, AuthGrantedRolesRef} from '../../media-type/doc-model/auth';



@Injectable()
export class FirebaseUserService implements UserService {


  private ref: Reference
  private authSettingsRef: Reference
  private grantedPermissionsRef: Reference
  private effectivePermissionsRef: Reference
  private grantedRolesRef: Reference

  private permissionService: FirebasePermissionService
  private roleService: FirebaseRoleService

  private subscriptions: Subscription[] = []

  constructor(private fb: FirebaseProvider, private bus:MessageBus, permService: PermissionService, roleService: RoleService) {
    this.permissionService = <FirebasePermissionService>permService
    this.roleService = <FirebaseRoleService>roleService

    const db = fb.app.database()
    this.ref = AuthUsersFirebaseRef(db)
    this.authSettingsRef = AuthSettingsFirebaseRef(db)
    this.grantedPermissionsRef = AuthGrantedPermissionsRef(db)
    this.effectivePermissionsRef = AuthEffectivePermissionsRef(db)
    this.grantedRolesRef = AuthGrantedRolesRef(db)
    this.engagePermissionsSynchronization()
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
    return FireBlanket.value(this.grantedPermissionsRef)
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
    return FireBlanket.value(this.grantedRolesRef).then(snap => snap.val()).then((userToRoles): any => {
      if (userToRoles) {
        const usersWithRemovedRole = Object.keys(userToRoles).filter((key) => {
          return !!userToRoles[key][roleKey]
        })
        usersWithRemovedRole.forEach((ruleKey: string) => {
          //noinspection JSIgnoredPromiseFromCall
          this.revokeRole(ruleKey, roleKey).catch((reason) => {
            console.error('FirebaseUserService', 'Revoke role failed.', reason)
            throw reason
          })
        })
      }
    }).catch((reason) => {
      console.error('FirebaseUserService', 'engageRoleSynchronization', reason)
    })
  }


  getUserFragment(key: AuthUserKey): Promise<AuthUser> {
    const cRef = this.ref.child(key)
    return FireBlanket.value(cRef).then(this.snapToValue)
      .then(dm => AuthUserTransform.fragmentFromDocModel(dm, dm ? dm.$key : null))
  }

  getUser(key: AuthUserKey): Promise<AuthUser> {
    let effectivePermissions: ObjMap<AuthPermission>
    let grantedPermissions: ObjMap<AuthPermission>
    let grantedRoles: ObjMap<AuthRole>
    return this.getUserFragment(key).then((userFragment: AuthUser) => {
      return Promise.all([
        this.effectivePermissionsFor(userFragment.$key).then(ep => effectivePermissions = ep),
        this.grantedPermissionsFor(userFragment.$key).then(gp => grantedPermissions = gp),
        this.grantedRolesFor(userFragment.$key).then(r => grantedRoles = r),
      ]).then(() => {
          const authUser = new AuthUser(key)
          authUser.effectivePermissions = ObjMapUtil.toKeyedEntityArray(effectivePermissions)
          authUser.grantedPermissions = ObjMapUtil.toKeyedEntityArray(grantedPermissions)
          authUser.grantedRoles = ObjMapUtil.toKeyedEntityArray(grantedRoles)
          return authUser
        }
      )
    })
  }

  awaitUsers$(): Observable<AuthUserDm[]> {
    return FireBlanket.awaitValue$(this.ref).map(this.snapMapToValue)
  }

  valuesOnce(): Promise<AuthPermission[]> {
    return FireBlanket.value(this.ref).then(this.snapMapToValue)

  }

  create(child: AuthUser): Promise<void> {
    const cRef = this.ref.child(child.$key)
    return FireBlanket.set(cRef, AuthUserTransform.toDocModel(child))

  }

  update(child: AuthUser): Promise<void> {
    const cRef = this.ref.child(child.$key)
    const data = AuthUserTransform.toDocModel(child)
    Logger.trace(this.bus, this, '#update', JSON.stringify(data))
    return FireBlanket.set(cRef, data).catch(e => {
      Logger.error(this.bus, this, '#update', 'failed: ', data.email)
      throw e
    })
  }


  remove(childKey: AuthUserKey): Promise<void> {
    const cRef = this.ref.child(childKey)
    return FireBlanket.remove(cRef)
  }

  private authSettings$() {
    return FireBlanket.awaitValue$(this.authSettingsRef)
      .map(snap => snap.val())
      .map(docModel => AuthTransform.fragmentFromDocModel(docModel))
  }


  effectivePermissionsFor(userKey: AuthUserKey): Promise<ObjMap<AuthPermission>> {
    return FireBlanket.awaitValue$(this.effectivePermissionsRef.child(userKey))
      .first().toPromise().then(snap => {
        return this.authSettings$().first().toPromise().then(authCdm => {
          const v: ObjMap<AuthRoleDm> = snap.val()
          const permissions: ObjMap<AuthPermission> = {}
          let permissionSmap = authCdm.permissionsMap()
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
        return this.authSettings$().first().toPromise().then(authCdm => {
          const v: ObjMap<AuthRoleDm> = snap.val()
          const permissions: ObjMap<AuthPermission> = {}
          let permissionSmap = authCdm.permissionsMap()
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
        return this.authSettings$().first().toPromise().then(authCdm => {
          const v: ObjMap<AuthRoleDm> = snap.val()
          const roles: ObjMap<AuthRole> = {}
          let roleMap = authCdm.rolesMap()
          ObjectUtil.entries(v).forEach(entry => {
            roles[entry.key] = roleMap[entry.key]
          })
          return roles
        })

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


  getRolePermissionsFor(userKey: AuthUserKey): Promise<ObjMap<AuthPermission>> {
    const userRolesRef = this.grantedRolesRef.child(userKey)
    return FireBlanket.value(userRolesRef).then(this.userPermissionsFromUserRolesMapping)
  }

  grantEffectivePermission(user: AuthUser, permission: AuthPermission): Promise<void> {
    const userEffPermRef = this.effectivePermissionsRef.child(user.$key).child(permission.$key)
    return FireBlanket.set(userEffPermRef, true)
  }

  revokeEffectivePermission(user: AuthUser, permission: AuthPermission): Promise<void> {
    const userEffPermRef = this.effectivePermissionsRef.child(user.$key).child(permission.$key)
    return FireBlanket.remove(userEffPermRef)
  }

  grantPermission(user: AuthUser, permission: AuthPermission): Promise<void> {
    const userGrantedPermRef = this.grantedPermissionsRef.child(user.$key).child(permission.$key)
    return FireBlanket.set(userGrantedPermRef, true).then(() => {
      return this.grantEffectivePermission(user, permission)
    })
  }

  revokePermission(userKey: AuthUserKey, permission: AuthPermission | string): Promise<void> {
    const permissionKey: string = AuthPermission.guard(permission) ? permission.$key : permission

    const userGrantedPermRef = this.grantedPermissionsRef.child(userKey).child(permissionKey)
    return FireBlanket.remove(userGrantedPermRef).then(() => {
      return this.updateEffectivePermissionsForUser(userKey)
    })
  }

  updateEffectivePermissionsForUser(userKey: string): Promise<void> {
    return this.calculateEffectivePermissionsForUser(userKey).then((effectivePermissions) => {
      const userEffPermRef = this.effectivePermissionsRef.child(userKey)
      return FireBlanket.set(userEffPermRef, ObjMapUtil.toTruthMap(effectivePermissions))
    }).catch(reason => {
      console.error('FirebaseUserService', 'updateEffectivePermissionsForUser failed', reason)
      throw reason
    })
  }

  grantRole(user: AuthUser, role: AuthRole): Promise<void> {
    const userGrantedRoleRef = this.grantedRolesRef.child(user.$key).child(role.$key)
    return FireBlanket.set(userGrantedRoleRef, true).then(() => {
      return this.updateEffectivePermissionsForUser(user.$key)
    })
  }

  revokeRole(userKey: AuthUserKey, roleKey: AuthRoleKey): Promise<void> {
    const userGrantedRoleRef = this.grantedRolesRef.child(userKey).child(roleKey)
    return FireBlanket.remove(userGrantedRoleRef).then(() => {
      return this.updateEffectivePermissionsForUser(userKey)
    })
  }

  getRolesFor(userKey: AuthUserKey): Promise<AuthRole[]> {
    const userGrantedRoleRef = this.grantedRolesRef.child(userKey)
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

  getGrantedPermissionsFor(userKey: AuthUserKey): Promise<AuthPermission[]> {
    const userGrantedPermRef = this.grantedPermissionsRef.child(userKey)
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
    return this.getRolePermissionsFor(userKey).then((effectivePermissions: ObjMap<AuthPermission>) => {
      return this.getGrantedPermissionsFor(userKey).then((grantedPermissions) => {
        return ObjMapUtil.addAll(effectivePermissions, ObjMapUtil.fromKeyedEntityArray(grantedPermissions))
      })
    }).catch(reason => console.error('FirebaseUserService', 'calculateEffectivePermissionsForUser failed', reason))
  }

  getEffectivePermissionsFor(userKey: AuthUserKey): Promise<AuthPermission[]> {
    let promise: Promise<AuthPermission[]>
    if (!userKey) {
      promise = new Promise((resolve) => resolve([]))
    } else {
      const userEffPermRef = this.effectivePermissionsRef.child(userKey)

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
    return FireBlanket.value(this.grantedRolesRef).then(snap => snap.val())
  }

  removeUserRoles(...forUserKeys: string[]): Promise<void> {
    const promises: Promise<void>[] = forUserKeys.map((key) => FireBlanket.remove(this.grantedRolesRef.child(key)))
    return Promise.all(promises).then(() => null)
  }


  destroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe())
  }
}
