import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewEncapsulation} from '@angular/core'
import {AuthPermission, PermissionService} from '@tangential/authorization-service'
import {NameGenerator} from '@tangential/core'
import {AdminConsoleParentPage} from '../_parent/admin-console-parent.page'

@Component({
  selector:        'tanj-permission-manager',
  templateUrl:     './permission-manager.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation:   ViewEncapsulation.None
})
export class PermissionManagerPage implements OnInit {

  rows: AuthPermission[] = [];
  selected: any[] = [];

  constructor(private permissionService: PermissionService,
              private parent: AdminConsoleParentPage,
              private changeDetectorRef: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.parent.authCdm$.subscribe({
      next: (v) => {
        this.rows = v.permissions
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

  onAddItemAction() {
    const permission = AuthPermission.from({
      $key:       NameGenerator.generate(),
      orderIndex: this.nextItemIndex
    })
    this.permissionService.create(permission).catch((reason) => {
      console.error('PermissionManagerPage', 'error adding permission', reason)
      throw new Error(reason)
    })
  }

  onRemove(key: string) {
    this.permissionService.remove(key).catch((reason) => {
      console.error('PermissionManagerPage', 'error removing permission', reason)
      throw new Error(reason)
    })
  }

  onRemoveSelectedAction(keys: string[]) {
    keys.forEach((key) => {
      this.permissionService.remove(key).catch((reason) => {
        console.error('PermissionManagerPage', 'error removing permission', reason)
        throw new Error(reason)
      })
    })
  }


  onItemChange(permission: AuthPermission) {
    this.permissionService.update(permission, permission).catch((reason) => {
      console.error('PermissionManagerPage', 'error updating permission', reason)
      throw new Error(reason)
    })

  }

}
