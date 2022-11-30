import {LiveAnnouncer} from '@angular/cdk/a11y'
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {AdminService, AuthPermission} from '@tangential/authorization-service';
import {NameGenerator} from '@tangential/core';
import {AdminConsoleParentPage} from '../_parent/admin-console-parent.page';
import {MatSort, Sort} from '@angular/material/sort';
import {SelectionModel} from '@angular/cdk/collections';
import {MatTableDataSource} from '@angular/material/table';

@Component({
  selector:        'tanj-permission-manager',
  templateUrl:     './permission-manager.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation:   ViewEncapsulation.None
})
export class PermissionManagerPage implements OnInit {
  displayedColumns: string[] = ['select', '$key', 'description', 'createdMils', 'editedMils'];
  dataSource = new MatTableDataSource<AuthPermission>();
  selection = new SelectionModel<AuthPermission>(true, []);

  rows: AuthPermission[] = [];
  selected: any[] = [];

  constructor(private adminService: AdminService,
              private parent: AdminConsoleParentPage,
              private _liveAnnouncer: LiveAnnouncer,
              private changeDetectorRef: ChangeDetectorRef) {
  }

  @ViewChild(MatSort) sort: MatSort;

  ngOnInit() {
    this.parent.auth$.subscribe({
      next: (v) => {
        this.rows = v.settings.permissions
        this.dataSource = new MatTableDataSource<AuthPermission>(v.settings.permissions);
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

  onAddItemAction() {
    const permission = AuthPermission.from({
      $key:       NameGenerator.generate(),
      orderIndex: this.nextItemIndex
    })
    this.adminService.addPermission(permission).catch((reason) => {
      console.error('PermissionManagerPage', 'error adding permission', reason)
      throw new Error(reason)
    })
  }

  onRemove(key: string) {
    this.adminService.removePermission(key).catch((reason) => {
      console.error('PermissionManagerPage', 'error removing permission', reason)
      throw new Error(reason)
    })
  }

  onRemoveSelectedAction(keys: string[]) {
    keys.forEach((key) => {
      this.adminService.removePermission(key).catch((reason) => {
        console.error('PermissionManagerPage', 'error removing permission', reason)
        throw new Error(reason)
      })
    })
  }


  onItemChange(permission: AuthPermission) {
    this.adminService.updatePermission(permission).catch((reason) => {
      console.error('PermissionManagerPage', 'error updating permission', reason)
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
  checkboxLabel(row?: AuthPermission): string {
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
