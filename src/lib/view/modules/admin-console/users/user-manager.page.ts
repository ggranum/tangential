import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewEncapsulation} from '@angular/core'
import {AuthPermission, AuthRole, AuthUser, UserService} from '@tangential/authorization-service'
import {generatePushID} from '@tangential/core'
import {AdminConsoleParentPage} from '../_parent/admin-console-parent.page'


@Component({
  selector:        'tanj-user-manager-page',
  templateUrl:     './user-manager.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation:   ViewEncapsulation.None
})
export class UserManagerPage implements OnInit {

  rows: any[] = []
  selected = []
  columns = [
    {prop: '$key', name: 'Key', flexGrow: 1},
    {prop: 'displayName', name: 'Display Name', flexGrow: 2},
    {prop: 'email', name: 'Created', flexGrow: 2},
    {prop: 'lastSignInMils', name: 'Last Sign In', flexGrow: 1}
  ]


  constructor(private userService: UserService,
              private parent: AdminConsoleParentPage,
              private changeDetectorRef: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.parent.authCdm$.subscribe({
      next: (v) => {
        this.rows = v.users
        this.changeDetectorRef.markForCheck()
      }
    })
  }


  onSelect({selected}) {
    console.log('Select Event', selected, this.selected);

    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }

  onActivate(event) {
    console.log('Activate Event', event);
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
    this.userService.revokeRole(user.$key, role.$key).catch((reason) => {
      console.error('UserManagerComponent', 'could not revoke role', reason)
    })
  }


  onAddItemAction() {
    const user = new AuthUser(generatePushID())
    user.displayName = 'New User '
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
    this.userService.update(user).catch((reason) => {
      console.error('UserManagerComponent', 'error updating user', reason)
      throw new Error(reason)
    })

  }

}
