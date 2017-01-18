import {Component, ChangeDetectionStrategy} from "@angular/core";
import {Observable} from "rxjs";
import {OMap} from "@tangential/common";
import {AuthRole, AuthPermission} from "@tangential/media-types";


@Component({
  selector: 'tang-role-list',
  template: ` 
 <tang-role-list-component 
 [roles]="roles$ | async"
 [permissions]="permissions$ | async"
 (addRole)="onAddRole($event)"
 (roleChange)="onRoleChange($event)"
 (removeRole)="onRemoveRole($event)"
 ></tang-role-list-component>
`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoleListContainer {

  roles$: Observable<OMap<string, AuthRole>>
  permissions$: Observable<OMap<string, AuthPermission>>

  constructor() {
  }

  onAddRole(role: AuthRole) {
  }

  onRoleChange(change: {current: AuthRole, previous: AuthRole}) {
  }

  onRemoveRole(role: AuthRole) {
  }
}

