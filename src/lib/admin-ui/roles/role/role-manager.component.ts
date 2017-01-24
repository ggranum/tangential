import {Component, ChangeDetectionStrategy, OnInit, ViewEncapsulation, Input, NgZone} from "@angular/core";
import {AuthRole, AuthPermission} from "@tangential/media-types";
import {Observable} from "rxjs";
import {RoleService, PermissionService} from "@tangential/authorization-service";
import {SelectionEntry, SelectionList} from "@tangential/common";


@Component({
  selector: 'tg-role-manager',
  template: `<tg-data-list [items]="allRoles$ | async"
              (addItemAction)="onAddItemAction()"
              (removeSelectedAction)="onRemoveSelectedAction($event)"
              [watchField]="watchMe"
              >

  <template let-rowItem>
    <tg-role flex layout="row"
             [role]="rowItem"
             (change)="onItemChange(rowItem)"
             (remove)="onRemove(rowItem.$key)"></tg-role>
  </template>

  <tg-data-list-expander>
    <template let-rowItem>
      <md-grid-list cols="4" rowHeight="3em" flex="80" >
        <md-grid-tile *ngFor="let permEntry of permissionsByRole[rowItem.$key] | async" 
          [colspan]="1"
          [rowspan]="1">
          <div flex class="tg-role-permission">
            <md-checkbox [checked]="permEntry.selected" (change)="permEntry.selected ?revokePermission(rowItem, permEntry.value) : grantPermission(rowItem, permEntry.value)">
              <span flex="50">{{permEntry.value.$key}}</span>
            </md-checkbox>
          </div>
        </md-grid-tile>
      </md-grid-list>
    </template>
  </tg-data-list-expander>
</tg-data-list>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class RoleManagerComponent implements OnInit {

  allRoles$: Observable<AuthRole[]> = null
  watchMe: number = 0
  permissionsByRole: {[roleKey: string]: Observable<SelectionEntry<AuthPermission>[]>} = {}

  _newIndex: number = 0

  constructor(private _permissionService: PermissionService, private _roleService: RoleService) {
  }

  ngOnInit() {
    this.allRoles$ = this._roleService.values().flatMap((roles: AuthRole[]) => {
      return this._permissionService.values().map((allPermissions) => {
        roles.forEach((role) => {
          if (role.$key.startsWith('New Role')) {
            try {
              let idx = Number.parseInt(role.$key.substr(role.$key.lastIndexOf(' '))) + 1
              this._newIndex = Math.max(this._newIndex, idx)
            } catch (e) {
              this._newIndex = Math.max(this._newIndex, 0)
            }
          }
          this.permissionsByRole[role.$key] = this._roleService.getPermissionsForRole$(role).map((rolePermissions) => {
            let list = new SelectionList<AuthPermission>(allPermissions)
            list.select(rolePermissions)
            this.watchMe++
            return list.entries
          })
        })
        return roles
      })
    })
  }

  grantPermission(role: AuthRole, permission: AuthPermission) {
    this._roleService.grantPermission(role, permission).catch((reason) => {
      console.log('RoleManagerComponent', 'could not grant permission', reason)
    })
  }

  revokePermission(role: AuthRole, permission: AuthPermission) {
    this._roleService.revokePermission(role, permission).catch((reason) => {
      console.log('RoleManagerComponent', 'could not revoke permission', reason)
    })
  }

  onAddItemAction() {
    let role = new AuthRole({
      $key: 'New Role ' + (this._newIndex),
    })
    this._roleService.create(role).catch((reason) => {
      console.error('RoleManagerComponent', 'error adding role', reason)
      throw new Error(reason)
    })
  }

  onRemove(key: string) {
    this._roleService.remove(key).catch((reason) => {
      console.error('RoleManagerComponent', 'error removing role', reason)
      throw new Error(reason)
    })
  }

  onRemoveSelectedAction(keys: string[]) {
    keys.forEach((key) => {
      this._roleService.remove(key).catch((reason) => {
        console.error('RoleManagerComponent', 'error removing role', reason)
        throw new Error(reason)
      })
    })
  }

  onItemChange(role: AuthRole) {
    console.log('AdminPage', 'onRoleChange', role)
    this._roleService.update(role, role).catch((reason) => {
      console.error('RoleManagerComponent', 'error updating role', reason)
      throw new Error(reason)
    })
  }

}
