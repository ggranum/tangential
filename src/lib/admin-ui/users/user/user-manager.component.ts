import {Component, ChangeDetectionStrategy, OnInit, ViewEncapsulation} from "@angular/core";
import {AuthUser, AuthPermission, AuthRole} from "@tangential/media-types";
import {Observable} from "rxjs";
import {UserService, PermissionService, RoleService} from "@tangential/authorization-service";
import {generatePushID, SelectionEntry, SelectionList} from "@tangential/common";


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
                           (change)="roleEntry.selected ?revokeRole(rowItem, roleEntry.value) : grantRole(rowItem, roleEntry.value)">
                <span flex="50">{{roleEntry.value.$key}}</span>
              </md-checkbox>
            </div>
          </md-grid-tile>
        </md-grid-list>
        <hr/>
        <div align="center"><h3>Permissions</h3></div>
        <md-grid-list cols="4" rowHeight="3em">
          <md-grid-tile *ngFor="let permEntry of permissionsByUser[rowItem.$key] | async"
                        [colspan]="1"
                        [rowspan]="1">
            <div flex class="tg-user-permission" flex>
              <md-checkbox [checked]="permEntry.selected"
                           (change)="permEntry.selected ?revokePermission(rowItem, permEntry.value) : grantPermission(rowItem, permEntry.value)">
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
  permissionsByUser: {[userKey: string]: Observable<SelectionEntry<AuthPermission>[]>} = {}
  rolesByUser: {[userKey: string]: Observable<SelectionEntry<AuthRole>[]>} = {}

  watchMe: number = 0
  _newIndex: number = 0

  constructor(private _userService: UserService, private _permissionService: PermissionService,
              private _roleService: RoleService) {
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
            this.permissionsByUser[user.$key] = this._userService.getPermissionsForUser(user).map((userPermissions) => {
              let list = new SelectionList<AuthPermission>(allPermissions)
              list.select(userPermissions)
              this.watchMe++
              return list.entries
            })

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
      console.log('UserManagerComponent', 'could not grant permission', reason)
    })
  }

  revokePermission(user: AuthUser, permission: AuthPermission) {
    this._userService.revokePermission(user, permission).catch((reason) => {
      console.log('UserManagerComponent', 'could not revoke permission', reason)
    })
  }

  grantRole(user: AuthUser, role: AuthRole) {
    this._userService.grantRole(user, role).catch((reason) => {
      console.log('UserManagerComponent', 'could not grant role', reason)
    })
  }

  revokeRole(user: AuthUser, role: AuthRole) {
    this._userService.revokeRole(user, role).catch((reason) => {
      console.log('UserManagerComponent', 'could not revoke role', reason)
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
    console.log('AdminPage', 'onUserChange', user)
    this._userService.update(user, user).catch((reason) => {
      console.error('UserManagerComponent', 'error updating user', reason)
      throw new Error(reason)
    })

  }

}
