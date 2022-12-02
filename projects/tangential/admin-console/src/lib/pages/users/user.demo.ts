import {ChangeDetectionStrategy, Component, ViewEncapsulation} from '@angular/core';
import {AuthPermission, AuthRole, AuthUser} from '@tangential/authorization-service';

@Component({
  selector: 'tanj-user-item-demo',
  template: `<h1>User Item Demo</h1>
  <div class='demo-content' layout="row" layout-align="center">
    <tanj-user
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

    </tanj-user>
  </div>           `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class UserListItemDemo {


  user: AuthUser

  roles: AuthRole[] = [
    AuthRole.from({
      '$key': 'DemoAdmin',
      'description': 'Administrator',
      'orderIndex': 1,
    }),
    AuthRole.from({
      '$key': 'DemoUser',
      'description': 'DemoUser',
      'orderIndex': 10
    }), AuthRole.from({
      '$key': 'DemoGuest',
      'description': 'DemoGuest',
      'orderIndex': 15
    })]

  permissions: AuthPermission[] = [
    AuthPermission.from({
      '$key': 'Add user',
      'description': 'Create new users manually',
      'orderIndex': 1
    }), AuthPermission.from({
      '$key': 'Remove user',
      'description': 'Remove a user account',
      'orderIndex': 10
    }), AuthPermission.from({
      '$key': 'Create permission',
      'description': 'Create a new Permission',
      'orderIndex': 20
    }), AuthPermission.from({
      '$key': 'Leave comment',
      'description': 'Leave a comment.',
      'orderIndex': 30
    }), AuthPermission.from({
      '$key': 'Remove comment',
      'description': 'Remove any comment',
      'orderIndex': 40
    }), AuthPermission.from({
      '$key': 'View comments',
      'description': 'View public comments',
      'orderIndex': 50
    }), AuthPermission.from({
      '$key': 'View own profile',
      'description': 'View own profile page',
      'orderIndex': 60
    })]


  constructor() {
    this.user = new AuthUser('abc12345abc234')
    this.user.displayName = 'Demo user'
    this.user.email = 'example@example.com'
    this.user.createdMils = Date.now()

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

