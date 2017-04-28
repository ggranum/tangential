import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewEncapsulation} from '@angular/core'
import {AuthPermission, AuthRole, RoleService} from '@tangential/authorization-service'
import {NameGenerator} from '@tangential/core'
import {RoleCdm} from '../../../../authorization-service/media-type/cdm/role-cdm'
import {AdminConsoleParentPage} from '../_parent/admin-console-parent.page'


@Component({
  selector:        'tanj-role-manager-page',
  templateUrl:     './role-manager.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation:   ViewEncapsulation.None
})
export class RoleManagerPage implements OnInit {

  rows: RoleCdm[] = [];
  selected: any[] = [];


  constructor(private roleService: RoleService,
              private parent: AdminConsoleParentPage,
              private changeDetectorRef: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.parent.authCdm$.subscribe({
      next: (v) => {
        this.rows = v.roles
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
    this.roleService.grantPermission(role, permission).catch((reason) => {
      console.error('RoleManagerComponent', 'could not grant permission', reason)
    })
  }

  revokePermission(role: AuthRole, permission: AuthPermission) {
    this.roleService.revokePermission(role, permission).catch((reason) => {
      console.error('RoleManagerComponent', 'could not revoke permission', reason)
    })
  }

  onAddItemAction() {
    const role = new AuthRole({
      $key:       NameGenerator.generate(),
      orderIndex: this.nextItemIndex
    })
    this.roleService.create(role).catch((reason) => {
      console.error('RoleManagerComponent', 'error adding role', reason)
      throw new Error(reason)
    })
  }

  onRemove(key: string) {
    this.roleService.remove(key).catch((reason) => {
      console.error('RoleManagerComponent', 'error removing role', reason)
      throw new Error(reason)
    })
  }

  onRemoveSelectedAction(keys: string[]) {
    keys.forEach((key) => {
      this.roleService.remove(key).catch((reason) => {
        console.error('RoleManagerComponent', 'error removing role', reason)
        throw new Error(reason)
      })
    })
  }

  onItemChange(role: AuthRole) {
    this.roleService.update(role, role).catch((reason) => {
      console.error('RoleManagerComponent', 'error updating role', reason)
      throw new Error(reason)
    })
  }

}
