import {LiveAnnouncer} from '@angular/cdk/a11y'
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core'
import {AdminService, AuthPermission, AuthRole, AuthUser, UserService} from '@tangential/authorization-service'
import {generatePushID} from '@tangential/core'
import {MatSort, Sort} from '@angular/material/sort';
import {SelectionModel} from '@angular/cdk/collections';
import {MatTableDataSource} from '@angular/material/table';
import {AdminConsoleParentPage} from '../_parent/admin-console-parent.page'


@Component({
  selector:        'tanj-user-manager-page',
  templateUrl:     './user-manager.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation:   ViewEncapsulation.None
})
export class UserManagerPage implements OnInit {
  displayedColumns: string[] = ['select', '$key', 'displayName', 'email', 'lastSignInMils'];
  dataSource = new MatTableDataSource<AuthUser>();
  selection = new SelectionModel<AuthUser>(true, []);

  rows: AuthUser[] = []
  selected = []
  columns = [
    {prop: '$key', name: 'Key', flexGrow: 1},
    {prop: 'displayName', name: 'Display Name', flexGrow: 2},
    {prop: 'email', name: 'Created', flexGrow: 2},
    {prop: 'lastSignInMils', name: 'Last Sign In', flexGrow: 1}
  ]


  constructor(private adminService: AdminService,
              private parent: AdminConsoleParentPage,
              private _liveAnnouncer: LiveAnnouncer,
              private changeDetectorRef: ChangeDetectorRef) {
  }

  @ViewChild(MatSort) sort: MatSort;

  ngOnInit() {
    this.parent.auth$.subscribe({
      next: (v) => {
        this.rows = v.users
        this.dataSource = new MatTableDataSource<AuthUser>(v.users);
        this.dataSource.sort = this.sort;
        this.changeDetectorRef.markForCheck()
      }
    })
  }


  grantPermission(user: AuthUser, permission: AuthPermission) {
    this.adminService.grantPermissionOnUser(user, permission).catch((reason) => {
      console.error('UserManagerComponent', 'could not grant permission', reason)
    })
  }

  revokePermission(user: AuthUser, permission: AuthPermission) {
    console.log('UserManagerComponent', 'revokePermission')
    this.adminService.revokePermissionOnUser(user, permission).catch((reason) => {
      console.error('UserManagerComponent', 'could not revoke permission', reason)
    })
  }

  grantRole(user: AuthUser, role: AuthRole) {
    this.adminService.grantRoleOnUser(user, role).catch((reason) => {
      console.error('UserManagerComponent', 'could not grant role', reason)
    })
  }

  revokeRole(user: AuthUser, role: AuthRole) {
    this.adminService.revokeRoleOnUser(user.$key, role.$key).catch((reason) => {
      console.error('UserManagerComponent', 'could not revoke role', reason)
    })
  }


  onAddItemAction() {
    const user = new AuthUser(generatePushID())
    user.displayName = 'New User '
    this.adminService.addUser(user).catch((reason) => {
      console.error('UserManagerComponent', 'error adding user', reason)
      throw new Error(reason)
    })
  }

  onRemove(key: string) {
    this.adminService.removeUser(key).catch((reason) => {
      console.error('UserManagerComponent', 'error removing user', reason)
      throw new Error(reason)
    })
  }

  onRemoveSelectedAction(keys: string[]) {
    keys.forEach((key) => {
      this.adminService.removeUser(key).catch((reason) => {
        console.error('UserManagerComponent', 'error removing user', reason)
        throw new Error(reason)
      })
    })
  }


  onItemChange(user: AuthUser) {
    this.adminService.updateUser(user).catch((reason) => {
      console.error('UserManagerComponent', 'error updating user', reason)
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
  checkboxLabel(row?: AuthUser): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} ${row.displayName}`;
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
