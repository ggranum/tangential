import {Component, ChangeDetectionStrategy} from "@angular/core";
import {Observable} from "rxjs";
import {OMap} from "@tangential/common";
import {AuthPermission} from "@tangential/media-types";


@Component({
  selector: 'tg-permission-list',
  template: ` 
 <tg-permission-list-component 
 [permissions]="permissions$ | async"
 (addPermission)="onAddPermission($event)"
 (permissionChange)="onPermissionChange($event)"
 (removePermission)="onRemovePermission($event)"
 ></tg-permission-list-component>
`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PermissionListContainer {

  permissions$: Observable<OMap<string, AuthPermission>>

  constructor() { }

  onAddPermission(permission: AuthPermission) {
  }

  onPermissionChange(change: {current: AuthPermission, previous: AuthPermission}) {
  }

  onRemovePermission(permission: AuthPermission) {
  }

}

