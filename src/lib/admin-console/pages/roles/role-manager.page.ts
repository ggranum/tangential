import {LiveAnnouncer} from '@angular/cdk/a11y'
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core'
import {AuthPermission, AuthRole, AdminService, AuthUser} from '@tangential/authorization-service'
import {NameGenerator} from '@tangential/core'
import {AdminConsoleParentPage} from '../_parent/admin-console-parent.page'

import {MatSort, Sort} from '@angular/material/sort';
import {SelectionModel} from '@angular/cdk/collections';
import {MatTableDataSource} from '@angular/material/table';


@Component({
  selector:        'tanj-role-manager-page',
  templateUrl:     './role-manager.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation:   ViewEncapsulation.None
})
export class RoleManagerPage implements OnInit {
  displayedColumns: string[] = ['select', '$key', 'description', 'createdMils', 'editedMils'];
  dataSource = new MatTableDataSource<AuthRole>();
  selection = new SelectionModel<AuthRole>(true, []);

  rows: AuthRole[] = [];
  selected: any[] = [];


  constructor(private parent: AdminConsoleParentPage,
              private adminService:AdminService,
              private _liveAnnouncer: LiveAnnouncer,
              private changeDetectorRef: ChangeDetectorRef) {
  }

  @ViewChild(MatSort) sort: MatSort;

  ngOnInit() {
    this.parent.auth$.subscribe({
      next: (v) => {
        this.rows = v.settings.roles
        this.dataSource = new MatTableDataSource<AuthRole>(v.settings.roles);
        this.dataSource.sort = this.sort;
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

  /**
   * Borrowed directly from Angular Material examples: https://material.angular.io/components/table/overview
   */
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.selection.select(...this.dataSource.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: AuthRole): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} ${row.description}`;
  }

  /** Announce the change in sort state for assistive technology. */
  announceSortChange(sortState: Sort) {
    // This example uses English messages. If your application supports
    // multiple language, you would internationalize these strings.
    // Furthermore, you can customize the message to add additional
    // details about the values being sorted.
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

}
