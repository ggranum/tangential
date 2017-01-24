import {AuthUser, AuthPermission, AuthRole} from "@tangential/media-types";
import {Observable, Subscription, BehaviorSubject} from "rxjs";
import {Injectable, NgZone} from "@angular/core";
import {ObjMap, OneToManyReferenceMap, ObjMapUtil} from "@tangential/common";
import {FirebaseService, ObservableReference, FirebaseProvider} from "@tangential/firebase-util";
//noinspection TypeScriptPreferShortImport
import {PermissionService} from "../permission/permission-service";
import {RoleService} from "../role/role-service";
import {UserService} from "./user-service";
//noinspection TypeScriptPreferShortImport
import {FirebasePermissionService} from "../permission/firebase-permission-service";
import {FirebaseRoleService} from "../role/firebase-role-service";


@Injectable()
export class FirebaseUserService extends FirebaseService<AuthUser> implements UserService {

  private $userGrantedPermissionsRef: ObservableReference<{[key: string]: {[key: string]: boolean}}, ObjMap<boolean>>
  private $userEffectivePermissionsRef: ObservableReference<{[key: string]: {[key: string]: boolean}}, ObjMap<boolean>>
  private $userRolesMappingRef: ObservableReference<{[key: string]: {[key: string]: boolean}}, ObjMap<boolean>>

  private _permissionService: FirebasePermissionService
  private _roleService: FirebaseRoleService
  private _subscriptions: Subscription[]

  constructor(private fb: FirebaseProvider, permService: PermissionService, roleService: RoleService, private _zone: NgZone) {
    super('/auth/users', fb.app.database(), (json: any, key: string) => {
      return json ? new AuthUser(Object.assign({}, json, {$key: key})) : null
    }, _zone)
    this._subscriptions = []
    this._permissionService = <FirebasePermissionService>permService
    this._roleService = <FirebaseRoleService>roleService
    let db = fb.app.database()
    this.$userGrantedPermissionsRef = new ObservableReference<{[userKey: string]: {[permissionKey: string]: boolean}}, ObjMap<boolean>>("/auth/user_granted_permissions", db, null, null, _zone)
    this.$userEffectivePermissionsRef = new ObservableReference<{[userKey: string]: {[permissionKey: string]: boolean}}, ObjMap<boolean>>("/auth/user_effective_permissions", db, null, null, _zone)
    this.$userRolesMappingRef = new ObservableReference<{[userKey: string]: {[roleKey: string]: boolean}}, ObjMap<boolean>>("/auth/user_roles", db, null, null, _zone)
    this.engagePermissionsSynchronization()
  }

  destroy(): void {
    super.destroy()
    this.$userGrantedPermissionsRef.destroy()
    this._subscriptions.forEach((sub) => sub.unsubscribe())
  }

  setUserRolesAndPermissions(usersHavePermissions: {[userKey: string]: {[permissionKey: string]: boolean}},
                             usersHaveRoles: {[userKey: string]: {[roleKey: string]: boolean}},
                             rolesHavePermissions: {[roleKey: string]: {[permissionKey: string]: boolean}}): Promise<void> {
    let users: any = {}
    Object.keys(usersHaveRoles).concat(Object.keys(usersHavePermissions)).forEach((key: string) => {
      users[key] = true
    })
    let userRolePermissions: {[userKey: string]: {[permissionKey: string]: boolean}} = {}
    Object.keys(usersHaveRoles).forEach((userKey) => {
      userRolePermissions[userKey] = this.gatherRolePermissions(usersHaveRoles[userKey], rolesHavePermissions)
    })

    let effectivePerms: OneToManyReferenceMap = {}
    Object.keys(users).forEach((userKey) => {
      effectivePerms[userKey] = ObjMapUtil.addAll(userRolePermissions[userKey], usersHavePermissions[userKey])
    })

    return this.$userRolesMappingRef.set(usersHaveRoles).then(() => {
      return this.$userGrantedPermissionsRef.set(usersHavePermissions).then(() => {
        return this.$userEffectivePermissionsRef.set(effectivePerms).then(() => {
        }).catch((reason) => {
          console.error('FirebaseUserService', 'set effective permission failed', reason)
          throw reason
        })

      })
    })
  }

  gatherRolePermissions(theUserHasRoles: {[roleKey: string]: boolean},
                        rolesHavePermissions: {[roleKey: string]: {[permissionKey: string]: boolean}}) {
    let rolePermissions: {[permissionKey: string]: boolean} = {}
    Object.keys(theUserHasRoles).forEach((roleKey) => {
      ObjMapUtil.addAll(rolePermissions, rolesHavePermissions[roleKey])
    })
    return rolePermissions
  }


  engagePermissionsSynchronization() {

    this._subscriptions.push(
      this._permissionService.valueRemoved$
        .subscribe((permKey: string) => {
          this.$userGrantedPermissionsRef.value().then((userToPermission): any => {
            if (userToPermission) {
              let usersWithRemovedPerm = Object.keys(userToPermission).filter((userKey) => {
                return !!userToPermission[userKey][permKey]
              })
              usersWithRemovedPerm.forEach((ruleKey: string) => {
                //noinspection JSIgnoredPromiseFromCall
                this._revokePermission(ruleKey, permKey).catch((reason) => {
                  console.error('FirebaseUserService', 'Revoke permission failed.', reason)
                  throw reason
                })
              })
            }
          }).catch((reason) => {
            console.error('FirebaseUserService', 'engagePermissionSynchronization', reason)
          })
        }))

    this._subscriptions.push(this._roleService.valueRemoved$.subscribe((roleKey: string) => {
      this.$userRolesMappingRef.value().then((userToRoles): any => {
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
    }))
  }

  getRolePermissionsForUser(userKey: string): Promise<ObjMap<AuthPermission>> {
    return new Promise((accept, reject) => {
      this.$userRolesMappingRef.child(userKey).value().then((roleKeys: ObjMap<boolean>) => {
        let userRolePermissions: ObjMap<AuthPermission> = {}
        let promises = Object.keys(roleKeys || {}).map((roleKey) => {
          return this._roleService.getPermissionsForRole(roleKey).then((rolePermissions) => {
            ObjMapUtil.addAll(userRolePermissions, ObjMapUtil.fromKeyedEntityArray(rolePermissions))
          })
        })
        Promise.all(promises).then(() => {
          accept(userRolePermissions)
        })
      })
    })
  }

  getRolePermissionsForUser$(user: AuthUser): Observable<ObjMap<AuthPermission>> {
    return this.$userRolesMappingRef.child(user.$key).value$.flatMap((roleKeys: ObjMap<boolean>) => {
      let userPermissions: ObjMap<AuthPermission> = {}
      let promises = Object.keys(roleKeys || {}).map((roleKey) => {
        return this._roleService.getPermissionsForRole(roleKey).then((rolePermissions) => {
          ObjMapUtil.addAll(userPermissions, ObjMapUtil.fromKeyedEntityArray(rolePermissions))
        })
      })
      return Observable.from(Promise.all(promises)).map(() => userPermissions)
    })
  }


  grantEffectivePermission(user: AuthUser, permission: AuthPermission): Promise<{user: AuthUser, permission: AuthPermission}> {
    return this.$userEffectivePermissionsRef.child(user.$key).child(permission.$key).set(true).then(() => {
      return {user: user, permission: permission}
    })
  }

  revokeEffectivePermission(user: AuthUser, permission: AuthPermission): Promise<{user: AuthUser, permission: AuthPermission}> {
    return this.$userEffectivePermissionsRef.child(user.$key).child(permission.$key).remove().then(() => {
      return {user: user, permission: permission}
    })
  }

  grantPermission(user: AuthUser, permission: AuthPermission): Promise<{user: AuthUser, permission: AuthPermission}> {
    return this.$userGrantedPermissionsRef.child(user.$key).child(permission.$key).set(true).then(() => {
      return this.grantEffectivePermission(user, permission)
    }).catch((reason) => {
      console.error('FirebaseUserService', 'grant permission failed', reason)
      throw reason
    })
  }

  revokePermission(user: AuthUser, permission: AuthPermission): Promise<{user: AuthUser, permission: AuthPermission}> {
    return this._revokePermission(user.$key, permission.$key).then(() => {
      return {user: user, permission: permission}
    })
  }

  private _revokePermission(userKey: string, permissionKey: string): Promise<{userKey: string, permissionKey: string}> {
    return this.$userGrantedPermissionsRef.child(userKey).child(permissionKey).remove().then(() => {
      return this.updateEffectivePermissionsForUser(userKey).then(() => {
        return {userKey, permissionKey}
      })
    }).catch((reason) => {
      console.error('FirebaseUserService', 'revoke failed', reason)
      throw reason
    })
  }

  updateEffectivePermissionsForUser(userKey: string): Promise<void> {
    return this.calculateEffectivePermissionsForUser(userKey).then((effectivePermissions) => {
      return this.$userEffectivePermissionsRef.child(userKey).set(ObjMapUtil.toTruthMap(effectivePermissions))
    }).catch(reason => {
      console.error('FirebaseUserService', 'updateEffectivePermissionsForUser failed', reason)
    })
  }

  grantRole(user: AuthUser, role: AuthRole): Promise<{user: AuthUser, role: AuthRole}> {
    return this.$userRolesMappingRef.child(user.$key).child(role.$key).set(true).then(() => {
      return this.updateEffectivePermissionsForUser(user.$key).then((v) => {
        return {user: user, role: role}
      })
    })
  }

  revokeRole(user: AuthUser, role: AuthRole): Promise<{user: AuthUser, role: AuthRole}> {
    return this._revokeRole(user.$key, role.$key).then(() => {
      return {user: user, role: role}
    })
  }

  private _revokeRole(userKey: string, roleKey: string): Promise<{userKey: string, roleKey: string}> {
    return this.$userRolesMappingRef.child(userKey).child(roleKey).remove().then(() => {
      return this.updateEffectivePermissionsForUser(userKey).then(() => {
        return {userKey: userKey, roleKey: roleKey}
      })
    })
  }

  getRolesForUser$(user: AuthUser): Observable<AuthRole[]> {
    return this.$userRolesMappingRef.child(user.$key).value$.flatMap((obj: ObjMap<boolean>) => {
      //noinspection JSMismatchedCollectionQueryUpdate
      let userRoles: AuthRole[] = []
      let promises: Promise<void>[] = []
      Object.keys(obj || {}).forEach(key => {
        promises.push(this._roleService.value(key).then((role: AuthRole) => {
          if (role) {
            userRoles.push(role)
          }
        }))
      })
      return Observable.from(Promise.all(promises).then(() => {
        return userRoles
      }))
    })
  }

  getGrantedPermissionsForUser$(user: AuthUser): Observable<AuthPermission[]> {
    return Observable.from(this.getGrantedPermissionsForUser(user.$key))
  }

  getGrantedPermissionsForUser(userKey: string): Promise<AuthPermission[]> {
    return this.$userGrantedPermissionsRef.child(userKey).value().then((obj: ObjMap<boolean>) => {
      //noinspection JSMismatchedCollectionQueryUpdate
      let grantedPermissions: AuthPermission[] = []
      let promises: Promise<void>[] = []
      Object.keys(obj || {}).forEach(key => {
        promises.push(this._permissionService.value(key).then((permission: AuthPermission) => {
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

  getEffectivePermissionsForUser$(user: AuthUser): Observable<AuthPermission[]> {
    let obs: Observable<AuthPermission[]>
    if (!user) {
      obs = Observable.from([])
    } else {
      obs = this.$userEffectivePermissionsRef.child(user.$key).value$.flatMap((obj: ObjMap<boolean>) => {
        //noinspection JSMismatchedCollectionQueryUpdate
        let effectivePermissions: AuthPermission[] = []
        let promises: Promise<void>[] = []
        Object.keys(obj || {}).forEach(key => {
          promises.push(this._permissionService.value(key).then((permission: AuthPermission) => {
            if (permission) {
              effectivePermissions.push(permission)
            }
          }))
        })
        return Observable.from(Promise.all(promises).then(() => {
          return effectivePermissions
        }))
      })
    }
    return obs
  }

  getUserRoles(): Promise<OneToManyReferenceMap> {
    return this.$userRolesMappingRef.value()
  }

  removeUserRoles(...forUserKeys: string[]): Promise<string[]> {
    let promises = forUserKeys.map((key) => this.$userRolesMappingRef.child(key).remove())
    return Promise.all(promises)
  }

}
