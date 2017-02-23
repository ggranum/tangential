import {Component, ChangeDetectionStrategy, OnInit, ViewEncapsulation, NgZone} from "@angular/core";
import {AuthUser, AuthPermission, AuthRole} from "@tangential/media-types";
import {Observable, BehaviorSubject} from "rxjs";
import {UserService, PermissionService, RoleService} from "@tangential/authorization-service";
import {generatePushID, SelectionEntry, SelectionList, ObjMap, ObjMapUtil} from "@tangential/common";


@Component({
  selector: 'tg-user-manager',
  template: `<tg-data-list [items]="allUsers$ | async"
              (addItemAction)="onAddItemAction()"
              (removeSelectedAction)="onRemoveSelectedAction($event)"
              [watchField]="watchMe"
              >

  <template let-rowItem>
    <tg-user fxFlex fxLayout="row"
             [user]="rowItem"
             (change)="onItemChange(rowItem)"
             (remove)="onRemove(rowItem.$key)"></tg-user>
  </template>

  <tg-data-list-expander>
    <template let-rowItem>
      <div fxLayout="column" fxLayoutAlign="start" fxFlex="80">
        <div align="center"><h3>Roles</h3></div>
        <md-grid-list cols="4" rowHeight="3em" fxFlex>
          <md-grid-tile *ngFor="let roleEntry of rolesByUser[rowItem.$key] | async"
                        [colspan]="1"
                        [rowspan]="1">
            <div fxFlex class="tg-user-role">
              <md-checkbox [checked]="roleEntry.selected"
                           (change)="$event.checked ? grantRole(rowItem, roleEntry.value) : revokeRole(rowItem, roleEntry.value) ">
                <span fxFlex="50">{{roleEntry.value.$key}}</span>
              </md-checkbox>
            </div>
          </md-grid-tile>
        </md-grid-list>
        <hr/>
        <div align="center"><h3>Permissions</h3></div>
        <md-grid-list cols="4" rowHeight="3em">
          <md-grid-tile *ngFor="let permEntry of grantedPermissionsByUser[rowItem.$key] | async"
                        [colspan]="1"
                        [rowspan]="1">
            <div fxFlex class="tg-user-permission" fxFlex>
              <md-checkbox [checked]="permEntry.selected"
                            [disabled]="permEntry.disabled"
                           (change)="$event.checked ? grantPermission(rowItem, permEntry.value) : revokePermission(rowItem, permEntry.value)">
                <span fxFlex="50">{{permEntry.value.$key}}</span>
              </md-checkbox>
            </div>
          </md-grid-tile>
        </md-grid-list>
      </div>
    </template>
  </tg-data-list-expander>

</tg-data-list>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class UserManagerComponent implements OnInit {


  allUsers$: Observable<AuthUser[]>
  grantedPermissionsByUser: {[userKey: string]: Observable<SelectionEntry<AuthPermission>[]>} = {}
  rolesByUser: {[userKey: string]: Observable<SelectionEntry<AuthRole>[]>} = {}

  watchMe: number = 0
  _newIndex: number = 0

  constructor(private _userService: UserService, private _permissionService: PermissionService,
              private _roleService: RoleService, private _zone:NgZone) {
  }

  ngOnInit() {
    this.allUsers$ = this._userService.values().flatMap((users: AuthUser[]) => {
      return this._permissionService.values().flatMap((allPermissions) => {
        return this._roleService.values().map((allRoles) => {
          users.forEach((user) => {
            if (user.$key.startsWith('New User')) {
              try {
                let idx = Number.parseInt(user.$key.substr(user.$key.lastIndexOf(' '))) + 1
                this._newIndex = Math.max(this._newIndex, idx)
              } catch (e) {
                this._newIndex = Math.max(this._newIndex, 0)
              }
            }
            let grantedSubject = new BehaviorSubject([])
            this.grantedPermissionsByUser[user.$key] = grantedSubject.asObservable()
            this._userService.getRolePermissionsForUser$(user).flatMap((userRolePermissionsMap:ObjMap<AuthPermission>) => {
              return this._userService.getGrantedPermissionsForUser$(user).map((userGrantedPermissions) => {
                let list = new SelectionList<AuthPermission>(allPermissions)
                list.select(userGrantedPermissions)
                let userRolePermissions = ObjMapUtil.toKeyedEntityArray(userRolePermissionsMap)
                list.select(userRolePermissions)
                list.disable(userRolePermissions)
                this.watchMe++
                grantedSubject.next(list.entries)
              })
            }).subscribe((v)=>{ })

            this.rolesByUser[user.$key] = this._userService.getRolesForUser$(user).map((userRoles) => {
              let list = new SelectionList<AuthRole>(allRoles)
              list.select(userRoles)
              this.watchMe++
              return list.entries
            })
          })
          return users
        })
      })
    })
  }


  grantPermission(user: AuthUser, permission: AuthPermission) {
    this._userService.grantPermission(user, permission).catch((reason) => {
      console.error('UserManagerComponent', 'could not grant permission', reason)
    })
  }

  revokePermission(user: AuthUser, permission: AuthPermission) {
    console.log('UserManagerComponent', 'revokePermission')
    this._userService.revokePermission(user, permission).catch((reason) => {
      console.error('UserManagerComponent', 'could not revoke permission', reason)
    })
  }

  grantRole(user: AuthUser, role: AuthRole) {
    this._userService.grantRole(user, role).catch((reason) => {
      console.error('UserManagerComponent', 'could not grant role', reason)
    })
  }

  revokeRole(user: AuthUser, role: AuthRole) {
    this._userService.revokeRole(user, role).catch((reason) => {
      console.error('UserManagerComponent', 'could not revoke role', reason)
    })
  }


  onAddItemAction() {
    let user = new AuthUser({
      $key: generatePushID(),
      displayName: 'New User ' + (this._newIndex),
    })
    this._userService.create(user).catch((reason) => {
      console.error('UserManagerComponent', 'error adding user', reason)
      throw new Error(reason)
    })
  }

  onRemove(key: string) {
    this._userService.remove(key).catch((reason) => {
      console.error('UserManagerComponent', 'error removing user', reason)
      throw new Error(reason)
    })
  }

  onRemoveSelectedAction(keys: string[]) {
    keys.forEach((key) => {
      this._userService.remove(key).catch((reason) => {
        console.error('UserManagerComponent', 'error removing user', reason)
        throw new Error(reason)
      })
    })
  }


  onItemChange(user: AuthUser) {
    this._userService.update(user, user).catch((reason) => {
      console.error('UserManagerComponent', 'error updating user', reason)
      throw new Error(reason)
    })

  }

}
