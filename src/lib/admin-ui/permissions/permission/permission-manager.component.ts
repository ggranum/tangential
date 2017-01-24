import { Component, ChangeDetectionStrategy, OnInit, ViewEncapsulation } from "@angular/core";
import {AuthPermission} from "@tangential/media-types";
import {Observable} from "rxjs";
import {PermissionService} from "@tangential/authorization-service";

@Component({
  selector: 'tg-permission-manager',
  template: `<tg-data-list [items]="allPermissions$ | async"
              (addItemAction)="onAddItemAction()"
              (removeSelectedAction)="onRemoveSelectedAction($event)">

  <template let-rowItem>
    <tg-permission flex layout="row"
                   [permission]="rowItem"
                   (change)="onItemChange(rowItem)"
                   (remove)="onRemove(rowItem.$key)"></tg-permission>
  </template>

</tg-data-list>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class PermissionManagerComponent implements OnInit {


  allPermissions$: Observable<AuthPermission[]>

  maxPermIndex: number = 0

  constructor(private _permissionService: PermissionService) {
  }

  ngOnInit() {
    console.log('PermissionManagerComponent', 'ngOnInit')

    this.allPermissions$ = this._permissionService.values().map((permissions: AuthPermission[]) => {
      console.log('AdminPage', 'Permissions updated')
      permissions.sort((a, b) => {
        return a.orderIndex - b.orderIndex
      })
      this.maxPermIndex = permissions.length === 0 ? 0 : permissions[permissions.length - 1].orderIndex
      return permissions
    })
  }

  onAddItemAction() {
    let permission = new AuthPermission({
      $key: 'New Permission ' + (this.maxPermIndex + 1),
      orderIndex: (this.maxPermIndex + 1)
    })
    this._permissionService.create(permission).catch((reason)=>{
      console.error('PermissionManagerComponent', 'error adding permission', reason)
      throw new Error(reason)
    })
  }

  onRemove(key: string) {
    console.log('PermissionManagerComponent', 'onRemove', key)
    this._permissionService.remove(key).catch((reason)=>{
      console.error('PermissionManagerComponent', 'error removing permission', reason)
      throw new Error(reason)
    })
  }

  onRemoveSelectedAction(keys: string[]) {
    keys.forEach((key) => {
      this._permissionService.remove(key).catch((reason)=>{
        console.error('PermissionManagerComponent', 'error removing permission', reason)
        throw new Error(reason)
      })
    })
  }


  onItemChange(permission: AuthPermission) {
    console.log('AdminPage', 'onPermissionChange', permission)
    this._permissionService.update(permission, permission).catch((reason)=>{
      console.error('PermissionManagerComponent', 'error updating permission', reason)
      throw new Error(reason)
    })

  }

}
