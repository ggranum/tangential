import {AuthUser, AuthPermission, AuthRole} from "@tangential/media-types";
import {Observable, Subscription} from "rxjs";
import {Injectable} from "@angular/core";
import {ObjMap, OneToManyReferenceMap, ObjMapUtil} from "@tangential/common";
import {FirebaseService, ObservableReference, FirebaseProvider} from "@tangential/firebase";
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

  private permissionService: FirebasePermissionService
  private roleService: FirebaseRoleService
  private _subscriptions: Subscription[]

  constructor(private fb: FirebaseProvider, permService: PermissionService, roleService: RoleService) {
    super('/auth/users', fb.app.database(), (json: any, key: string) => {
      return json ? new AuthUser(Object.assign({}, json, {$key: key})) : null
    })
    this._subscriptions = []
    this.permissionService = <FirebasePermissionService>permService
    this.roleService = <FirebaseRoleService>roleService
    let db = fb.app.database()
    this.$userGrantedPermissionsRef = new ObservableReference<{[userKey: string]: {[permissionKey: string]: boolean}}, ObjMap<boolean>>("/auth/user_granted_permissions", db)
    this.$userEffectivePermissionsRef = new ObservableReference<{[userKey: string]: {[permissionKey: string]: boolean}}, ObjMap<boolean>>("/auth/user_effective_permissions", db)
    this.$userRolesMappingRef = new ObservableReference<{[userKey: string]: {[roleKey: string]: boolean}}, ObjMap<boolean>>("/auth/user_roles", db)
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
          console.log('FirebaseUserService', 'set effective permission succeeded', effectivePerms)
        }).catch((reason) => {
          console.log('FirebaseUserService', 'set effective permission failed', reason)
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
      this.permissionService.valueRemoved$
        .subscribe((permKey: string) => {
          this.$userGrantedPermissionsRef.value().then((userToPermission): any => {
            if (userToPermission) {
              let usersWithRemovedPerm = Object.keys(userToPermission).filter((userKey) => {
                return !!userToPermission[userKey][permKey]
              })
              usersWithRemovedPerm.forEach((ruleKey: string) => {
                //noinspection JSIgnoredPromiseFromCall
                this._revokePermission(ruleKey, permKey).catch((reason) => {
                  console.log('FirebaseUserService', 'Revoke permission failed.', reason)
                  throw reason
                })
              })
            }
          }).catch((reason) => {
            console.error('FirebaseUserService', 'engagePermissionSynchronization', reason)
          })
        }))

    this._subscriptions.push(this.roleService.valueRemoved$.subscribe((roleKey: string) => {
      this.$userRolesMappingRef.value().then((ruleToRoles): any => {
        if (ruleToRoles) {
          let rulesWithRemovedPerm = Object.keys(ruleToRoles).filter((key) => {
            return !!ruleToRoles[key][roleKey]
          })
          rulesWithRemovedPerm.forEach((ruleKey: string) => {
            //noinspection JSIgnoredPromiseFromCall
            this._revokeRole(ruleKey, roleKey).catch((reason) => {
              console.log('FirebaseUserService', 'Revoke role failed.', reason)
              throw reason
            })
          })
        }
      }).catch((reason) => {
        console.error('FirebaseUserService', 'engageRoleSynchronization', reason)
      })
    }))
  }

  getRolePermissionsForUser(userKey: string): Promise<ObjMap<boolean>> {
    return this.$userRolesMappingRef.child(userKey).value().then((roleKeys: ObjMap<boolean>) => {
      let promises = Object.keys(roleKeys || {}).map((roleKey) => {
        this.roleService.getPermissionsForRole(roleKey).then((perms: AuthPermission[]) => {
        })
      })
      return Promise.all(promises)
    })
  }

  grantPermission(user: AuthUser, permission: AuthPermission): Promise<{user: AuthUser, permission: AuthPermission}> {
    console.log('FirebaseUserService', 'granting permission:', permission.$key)
    return this.$userGrantedPermissionsRef.child(user.$key).child(permission.$key).set(true).then(() => {
      return {user: user, permission: permission}
    }).catch((reason) => {
      console.log('FirebaseUserService', 'grant permission failed', reason)
      throw reason
    })

  }

  revokePermission(user: AuthUser, permission: AuthPermission): Promise<{user: AuthUser, permission: AuthPermission}> {
    console.log('FirebaseUserService', 'revoking permission', 'success', permission.$key)
    return this.$userGrantedPermissionsRef.child(user.$key).child(permission.$key).remove().then(() => {
      return {user: user, permission: permission}
    }).catch((reason) => {
      console.log('FirebaseUserService', 'revoke failed', reason)
      throw reason
    })
  }

  private _revokePermission(userKey: string, permissionKey: string): Promise<{userKey: string, permissionKey: string}> {
    console.log('FirebaseUserService', 'revoking permission', permissionKey)
    return this.$userGrantedPermissionsRef.child(userKey).child(permissionKey).remove().then(() => {
      return {userKey: userKey, permissionKey: permissionKey}
    }).catch((reason) => {
      console.log('FirebaseUserService', '_revoke permission failed', reason)
      throw reason
    })
  }


  getPermissionsForUser(user: AuthUser): Observable<AuthPermission[]> {
    return this.$userGrantedPermissionsRef.child(user.$key).value$.flatMap((obj: ObjMap<boolean>) => {
      //noinspection JSMismatchedCollectionQueryUpdate
      let userPerms: AuthPermission[] = []
      let promises: Promise<void>[] = []
      Object.keys(obj || {}).forEach(key => {
        promises.push(this.permissionService.value(key).then((perm: AuthPermission) => {
          if (perm) {
            userPerms.push(perm)
          }
        }))
      })
      return Observable.from(Promise.all(promises).then(() => {
        return userPerms
      }))
    })
  }

  grantRole(user: AuthUser, role: AuthRole): Promise<{user: AuthUser, role: AuthRole}> {
    return this.$userRolesMappingRef.child(user.$key).child(role.$key).set(true).then(() => {
      return {user: user, role: role}
    })
  }

  revokeRole(user: AuthUser, role: AuthRole): Promise<{user: AuthUser, role: AuthRole}> {
    return this.$userRolesMappingRef.child(user.$key).child(role.$key).remove().then(() => {
      return {user: user, role: role}
    })
  }

  private _revokeRole(userKey: string, roleKey: string): Promise<{userKey: string, roleKey: string}> {
    return this.$userRolesMappingRef.child(userKey).child(roleKey).remove().then(() => {
      return {userKey: userKey, roleKey: roleKey}
    })
  }

  getRolesForUser$(user: AuthUser): Observable<AuthRole[]> {
    return this.$userRolesMappingRef.child(user.$key).value$.flatMap((obj: ObjMap<boolean>) => {
      //noinspection JSMismatchedCollectionQueryUpdate
      let userRoles: AuthRole[] = []
      let promises: Promise<void>[] = []
      Object.keys(obj || {}).forEach(key => {
        promises.push(this.roleService.value(key).then((role: AuthRole) => {
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
    return this.$userGrantedPermissionsRef.child(user.$key).value$.flatMap((obj: ObjMap<boolean>) => {
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
      return Observable.from(Promise.all(promises).then(() => {
        return grantedPermissions
      }))
    })
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
          promises.push(this.permissionService.value(key).then((permission: AuthPermission) => {
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
