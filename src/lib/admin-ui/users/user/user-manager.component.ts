import {Component, ChangeDetectionStrategy, OnInit, ViewEncapsulation, NgZone, ChangeDetectorRef} from "@angular/core";
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
    <tg-user flex layout="row"
             [user]="rowItem"
             (change)="onItemChange(rowItem)"
             (remove)="onRemove(rowItem.$key)"></tg-user>
  </template>

  <tg-data-list-expander>
    <template let-rowItem>
      <div layout="column" layout-align="start" flex="80">
        <div align="center"><h3>Roles</h3></div>
        <md-grid-list cols="4" rowHeight="3em" flex>
          <md-grid-tile *ngFor="let roleEntry of rolesByUser[rowItem.$key] | async"
                        [colspan]="1"
                        [rowspan]="1">
            <div flex class="tg-user-role">
              <md-checkbox [checked]="roleEntry.selected"
                           (change)="$event.checked ? grantRole(rowItem, roleEntry.value) : revokeRole(rowItem, roleEntry.value) ">
                <span flex="50">{{roleEntry.value.$key}}</span>
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
            <div flex class="tg-user-permission" flex>
              <md-checkbox [checked]="permEntry.selected"
                            [disabled]="permEntry.disabled"
                           (change)="$event.checked ? grantPermission(rowItem, permEntry.value) : revokePermission(rowItem, permEntry.value)">
                <span flex="50">{{permEntry.value.$key}}</span>
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
  grantedPermissionsByUser: {[userKey: string]: Promise<SelectionEntry<AuthPermission>[]>} = {}
  rolesByUser: {[userKey: string]: Promise<SelectionEntry<AuthRole>[]>} = {}

  watchMe: number = 0
  _newIndex: number = 0

  constructor(private userService: UserService,
              private permissionService: PermissionService,
              private roleService: RoleService,
              private changeDetectorRef:ChangeDetectorRef) {
  }

  ngOnInit() {
    this.allUsers$ = this.userService.values().flatMap((users: AuthUser[]) => {
      return this.permissionService.values$().flatMap((allPermissions) => {
        return this.roleService.values().map((allRoles) => {
          users.forEach((user) => {
            if (user.$key.startsWith('New User')) {
              try {
                let idx = Number.parseInt(user.$key.substr(user.$key.lastIndexOf(' '))) + 1
                this._newIndex = Math.max(this._newIndex, idx)
              } catch (e) {
                this._newIndex = Math.max(this._newIndex, 0)
              }
            }

            this.grantedPermissionsByUser[user.$key] = this.userService.getRolePermissionsForUser(user).then((userRolePermissionsMap:ObjMap<AuthPermission>) => {
              return this.userService.getGrantedPermissionsForUser(user).then((userGrantedPermissions) => {
                let list = new SelectionList<AuthPermission>(allPermissions)
                list.select(userGrantedPermissions)
                let userRolePermissions = ObjMapUtil.toKeyedEntityArray(userRolePermissionsMap)
                list.select(userRolePermissions)
                list.disable(userRolePermissions)
                this.watchMe++
                return list.entries
              })
            })

            this.rolesByUser[user.$key] = this.userService.getRolesForUser(user).then((userRoles) => {
              let list = new SelectionList<AuthRole>(allRoles)
              list.select(userRoles)
              this.watchMe++
              return list.entries
            })
          })
          this.changeDetectorRef.markForCheck()
          return users
        })
      })
    })
  }


  grantPermission(user: AuthUser, permission: AuthPermission) {
    this.userService.grantPermission(user, permission).catch((reason) => {
      console.error('UserManagerComponent', 'could not grant permission', reason)
    })
  }

  revokePermission(user: AuthUser, permission: AuthPermission) {
    console.log('UserManagerComponent', 'revokePermission')
    this.userService.revokePermission(user, permission).catch((reason) => {
      console.error('UserManagerComponent', 'could not revoke permission', reason)
    })
  }

  grantRole(user: AuthUser, role: AuthRole) {
    this.userService.grantRole(user, role).catch((reason) => {
      console.error('UserManagerComponent', 'could not grant role', reason)
    })
  }

  revokeRole(user: AuthUser, role: AuthRole) {
    this.userService.revokeRole(user, role).catch((reason) => {
      console.error('UserManagerComponent', 'could not revoke role', reason)
    })
  }


  onAddItemAction() {
    let user = new AuthUser({
      $key: generatePushID(),
      displayName: 'New User ' + (this._newIndex),
    })
    this.userService.create(user).catch((reason) => {
      console.error('UserManagerComponent', 'error adding user', reason)
      throw new Error(reason)
    })
  }

  onRemove(key: string) {
    this.userService.remove(key).catch((reason) => {
      console.error('UserManagerComponent', 'error removing user', reason)
      throw new Error(reason)
    })
  }

  onRemoveSelectedAction(keys: string[]) {
    keys.forEach((key) => {
      this.userService.remove(key).catch((reason) => {
        console.error('UserManagerComponent', 'error removing user', reason)
        throw new Error(reason)
      })
    })
  }


  onItemChange(user: AuthUser) {
    this.userService.update(user, user).catch((reason) => {
      console.error('UserManagerComponent', 'error updating user', reason)
      throw new Error(reason)
    })

  }

}
