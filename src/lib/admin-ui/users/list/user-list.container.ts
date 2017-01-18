import {Component, ChangeDetectionStrategy} from "@angular/core";
import {Observable} from "rxjs";
import {OMap} from "@tangential/common";
import {AuthUser, AuthRole, AuthPermission} from "@tangential/media-types";


@Component({
  selector: 'tang-user-list',
  template: `<tang-user-list-component
  [allUsers]="users$ | async"
  [allRoles]="roles$ | async"
  [allPermissions]="permissions$ | async"
  (addUser)="onAddUser($event)"
  (userChange)="onUserChange($event)"
  (removeUser)="onRemoveUser($event)"
></tang-user-list-component>
`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserListContainer {

  users$: Observable<OMap<string, AuthUser>>
  roles$: Observable<OMap<string, AuthRole>>
  permissions$: Observable<OMap<string, AuthPermission>>

  constructor() { }

  onAddUser(user: AuthUser) { }

  onUserChange(user: AuthUser) { }

  onRemoveUser(user: AuthUser) { }

}

