import {AuthRole, AuthPermission} from "@tangential/media-types";
import {Observable} from "rxjs";
import {Injectable} from "@angular/core";
import {ObjMap, OneToManyReferenceMap} from "@tangential/common";

import {FirebaseService, ObservableReference, FirebaseProvider} from "@tangential/firebase";

import {RoleService} from "./role-service";
//noinspection TypeScriptPreferShortImport
import {PermissionService} from "../permission/permission-service";
//noinspection TypeScriptPreferShortImport
import {FirebasePermissionService} from "../permission/firebase-permission-service";

@Injectable()
export class FirebaseRoleService extends FirebaseService<AuthRole> implements RoleService {

  private $mappingRef: ObservableReference<{[key: string]: {[key: string]: boolean}}, ObjMap<boolean>>

  private permissionService: FirebasePermissionService

  constructor(private fb: FirebaseProvider, private permService: PermissionService) {
    super('/auth/roles', fb.app.database(), (json: any, key: string) => {
      return json ? new AuthRole(Object.assign({}, json, {$key: key})) : null
    })
    this.permissionService = <FirebasePermissionService>permService
    let db = fb.app.database()
    this.$mappingRef = new ObservableReference<OneToManyReferenceMap, ObjMap<boolean>>("/auth/role_permissions", db)
    this.engagePermissionsSynchronization()
  }

  destroy(): void {
    super.destroy()
    this.$mappingRef.destroy()
  }

  setRolePermissions(entities: OneToManyReferenceMap): Promise<void> {
    return this.$mappingRef.set(entities)
  }

  engagePermissionsSynchronization() {
    this.permissionService.valueRemoved$.subscribe((permissionKey: string) => {
      this.$mappingRef.value().then((ruleToPermissions): any => {
        console.log('FirebaseRoleService', 'Attempting to synchronize removed permission', permissionKey)
        if (ruleToPermissions) {
          let rulesWithRemovedPerm = Object.keys(ruleToPermissions).filter((key) => {
            return !!ruleToPermissions[key][permissionKey]
          })
          rulesWithRemovedPerm.forEach((ruleKey: string) => {
            //noinspection JSIgnoredPromiseFromCall
            this._revokePermission(ruleKey, permissionKey).catch((reason) => {
              console.log('FirebaseRoleService', 'Could not synchronize removed permission', permissionKey, reason)
            })
          })
        }
      }).catch((reason) => {
        console.error('FirebaseRoleService', 'engagePermissionSynchronization', reason)
      })
    })
  }

  grantPermission(role: AuthRole, permission: AuthPermission): Promise<{role: AuthRole, permission: AuthPermission}> {
    return this.$mappingRef.child(role.$key).child(permission.$key).set(true).then(() => {
      return {role: role, permission: permission}
    }).catch((reason) => {
      console.error('FirebaseRoleService', 'grant role failed', reason)
      throw reason
    })
  }

  revokePermission(role: AuthRole, permission: AuthPermission): Promise<{role: AuthRole, permission: AuthPermission}> {
    return this.$mappingRef.child(role.$key).child(permission.$key).remove().then(() => {
      return {role: role, permission: permission}
    })
  }

  private _revokePermission(roleKey: string, permissionKey: string): Promise<{roleKey: string, permissionKey: string}> {
    return this.$mappingRef.child(roleKey).child(permissionKey).remove().then(() => {
      return {roleKey: roleKey, permissionKey: permissionKey}
    }).catch((reason) => {
      console.error('FirebaseRoleService', 'Revoke Permission Failed', reason)
      throw reason
    })
  }

  getPermissionsForRole$(role: AuthRole|string): Observable<AuthPermission[]> {
    let key: string
    if (AuthRole.guard(role)) {
      key = role.$key
    } else {
      key = role
    }
    return this.$mappingRef.child(key).value$.flatMap((obj: ObjMap<boolean>) => {
      //noinspection JSMismatchedCollectionQueryUpdate
      let rolePerms: AuthPermission[] = []
      let promises: Promise<AuthPermission>[] = []
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


  getPermissionsForRole(role: AuthRole|string): Promise<AuthPermission[]> {
    return this.getPermissionsForRole$(role).toPromise()
  }


}
