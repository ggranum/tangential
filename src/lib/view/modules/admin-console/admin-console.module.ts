import {CommonModule} from '@angular/common'
import {NgModule} from '@angular/core'
import {FormsModule} from '@angular/forms'
import {
  MdButtonModule,
  MdButtonToggleModule,
  MdCheckboxModule,
  MdGridListModule,
  MdIconModule,
  MdInputModule,
  MdListModule,
  MdMenuModule,
  MdToolbarModule
} from '@angular/material'
import {TanjComponentsModule} from '@tangential/components'
import {DataTableModule} from 'primeng/primeng'
import {AdminService} from '@tangential/authorization-service'
import {AdminConsoleParentPage} from './_parent/admin-console-parent.page'
import {AdminConsoleRoutingModule} from './admin-console.routing.module'


//noinspection TypeScriptPreferShortImport
import {PermissionManagerPage} from './permissions/permission-manager.page'
import {PermissionComponent} from './permissions/permission.component'
import {RoleManagerPage} from './roles/role-manager.page'


import {RoleComponent} from './roles/role.component'
import {RoleAvatarComponent} from './users/role-avatar.component'

import {UserManagerPage} from './users/user-manager.page'
import {UserPermissionEditorComponent} from './users/user-permission-editor.component'
import {UserComponent} from './users/user.component'
//noinspection TypeScriptPreferShortImport
import {UserListItemDemo} from './users/user.demo'

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import {FirebaseAdminService} from '../../../authorization-service/state/admin-service/firebase-admin-service';


@NgModule({
  declarations: [
    AdminConsoleParentPage,
    RoleAvatarComponent,
    UserPermissionEditorComponent,
    UserListItemDemo,
    PermissionComponent,
    RoleComponent,
    UserComponent,
    PermissionManagerPage,
    RoleManagerPage,
    UserManagerPage,
  ],
  imports:      [
    CommonModule,
    FormsModule,
    MdButtonModule,
    MdIconModule,
    MdInputModule,
    MdListModule,
    MdGridListModule,
    MdMenuModule,
    MdToolbarModule,
    MdCheckboxModule,
    MdButtonToggleModule,

    TanjComponentsModule,
    DataTableModule,
    /* Routing */
    AdminConsoleRoutingModule
  ],
  providers:    [
    {provide: AdminService, useClass: FirebaseAdminService}
  ]

})
export class TanjAdminConsoleModule {

}
