import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewEncapsulation} from '@angular/core'
import {AuthPermission, AuthRole, AdminService} from '@tangential/authorization-service'
import {NameGenerator} from '@tangential/core'
import {AdminConsoleParentPage} from '../_parent/admin-console-parent.page'


@Component({
  selector:        'tanj-role-manager-page',
  templateUrl:     './role-manager.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation:   ViewEncapsulation.None
})
export class RoleManagerPage implements OnInit {

  rows: AuthRole[] = [];
  selected: any[] = [];


  constructor(private parent: AdminConsoleParentPage,
              private adminService:AdminService,
              private changeDetectorRef: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.parent.auth$.subscribe({
      next: (v) => {
        this.rows = v.settings.roles
        this.changeDetectorRef.markForCheck()
      }
    })
  }

  get nextItemIndex(): number {
    let idx = 1
    if (this.rows && this.rows.length) {
      idx = (this.rows[this.rows.length - 1].orderIndex + 1)
    }
    return idx
  }

  grantPermission(role: AuthRole, permission: AuthPermission) {
    this.adminService.grantPermissionOnRole(role.$key, permission.$key).catch((reason) => {
      console.error('RoleManagerComponent', 'could not grant permission', reason)
    })
  }

  revokePermission(role: AuthRole, permission: AuthPermission) {
    this.adminService.revokePermissionOnRole(role.$key, permission.$key).catch((reason) => {
      console.error('RoleManagerComponent', 'could not revoke permission', reason)
    })
  }

  onAddItemAction() {
    const role = AuthRole.from({
      $key:       NameGenerator.generate(),
      orderIndex: this.nextItemIndex
    })
    this.adminService.addRole(role).catch((reason) => {
      console.error('RoleManagerComponent', 'error adding role', reason)
      throw new Error(reason)
    })
  }

  onRemove(key: string) {
    this.adminService.removeRole(key).catch((reason) => {
      console.error('RoleManagerComponent', 'error removing role', reason)
      throw new Error(reason)
    })
  }

  onRemoveSelectedAction(keys: string[]) {
    keys.forEach((key) => {
      this.adminService.removeRole(key).catch((reason) => {
        console.error('RoleManagerComponent', 'error removing role', reason)
        throw new Error(reason)
      })
    })
  }

  onItemChange(role: AuthRole) {
    this.adminService.updateRole(role).catch((reason) => {
      console.log('RoleManagerComponent', 'error updating role', reason)
      throw new Error(reason)
    })
  }

}
