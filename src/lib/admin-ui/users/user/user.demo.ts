import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation
} from "@angular/core";
import {AuthUser, AuthRole, AuthPermission} from "@tangential/media-types";

@Component({
  selector: 'tg-user-item-demo',
  template: `<h1>User Item Demo</h1>
<div class='demo-content' layout="row" layout-align="center">
  <tg-user-component  
    flex
    [user]="user"
    [userRoles]="roles"
    [userGrantedPermissions]="permissions"
    [showSelector]="true"
    (selectionChange)="onSelectionChange($event)"
    (removeUser)="onRemoveUser($event)"
    (addUserRole)="onAddUserRole($event)"
    (removeUserRole)="onRemoveUserRole($event)"
    (addUserPermission)="onAddUserPermission($event)"
    (removeUserPermission)="onRemoveUserPermission($event)"
  >
    
</tg-user-component>
</div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class UserListItemDemo {

  user: AuthUser = new AuthUser({
    displayName: "Demo user",
    email: "example@example.com",
    createdMils: Date.now(),
    $key: "abc12345abc234"
  })

  roles: AuthRole[] = [
    new AuthRole({
      "$key": "DemoAdmin",
      "description": "Administrator",
      "orderIndex": 1,
    }),
    new AuthRole({
      "$key": "DemoUser",
      "description": "DemoUser",
      "orderIndex": 10
    }), new AuthRole({
      "$key": "DemoGuest",
      "description": "DemoGuest",
      "orderIndex": 15
    })]

  permissions: AuthPermission[] = [
    new AuthPermission({
    "$key": "Add user",
    "description": "Create new users manually",
    "orderIndex": 1
  }), new AuthPermission({
    "$key": "Remove user",
    "description": "Remove a user account",
    "orderIndex": 10
    }), new AuthPermission({
    "$key": "Create permission",
    "description": "Create a new Permission",
    "orderIndex": 20
    }), new AuthPermission({
    "$key": "Leave comment",
    "description": "Leave a comment.",
    "orderIndex": 30
    }), new AuthPermission({
    "$key": "Remove comment",
    "description": "Remove any comment",
    "orderIndex": 40
    }), new AuthPermission({
    "$key": "View comments",
    "description": "View public comments",
    "orderIndex": 50
    }), new AuthPermission({
    "$key": "View own profile",
    "description": "View own profile page",
    "orderIndex": 60
  })]


  constructor() {
  }

  onSelectionChange(event: any) {
    console.log('UserListItemDemo', 'onSelectionChange', event)
  }

  onRemoveUser(event: any) {
    console.log('UserListItemDemo', 'onRemoveUser', event)
  }

  onAddUserRole(event: any) {
    console.log('UserListItemDemo', 'onAddUserRole', event)
  }

  onRemoveUserRole(event: any) {
    console.log('UserListItemDemo', 'onRemoveUserRole', event)
  }

  onAddUserPermission(event: any) {
    console.log('UserListItemDemo', 'onAddUserPermission', event)
  }

  onRemoveUserPermission(event: any) {
    console.log('UserListItemDemo', 'onRemoveUserPermission', event)
  }

}

