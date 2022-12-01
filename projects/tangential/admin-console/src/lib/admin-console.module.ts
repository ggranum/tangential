import {CommonModule} from '@angular/common'
import {NgModule} from '@angular/core'
import {FormsModule} from '@angular/forms'
import {MatButtonModule} from '@angular/material/button'
import {MatButtonToggleModule} from '@angular/material/button-toggle'
import {MatCheckboxModule} from '@angular/material/checkbox'
import {MatGridListModule} from '@angular/material/grid-list'
import {MatIconModule} from '@angular/material/icon'
import {MatInputModule} from '@angular/material/input'
import {MatListModule} from '@angular/material/list'
import {MatMenuModule} from '@angular/material/menu'
import {MatSortModule} from '@angular/material/sort'
import {MatTableModule} from '@angular/material/table'
import {MatToolbarModule} from '@angular/material/toolbar'

import {TanjComponentsModule} from '@tangential/components'
import {AdminService} from '@tangential/authorization-service'
import {AdminConsoleParentPage} from './pages/_parent/admin-console-parent.page'
import {AdminConsoleRoutingModule} from './admin-console.routing.module'


//noinspection ES6PreferShortImport
import {PermissionManagerPage} from './pages/permission-manager/permission-manager.page'
import {PermissionComponent} from './components/permission/permission.component'
import {RoleManagerPage} from './pages/roles/role-manager.page'


import {RoleComponent} from './pages/roles/role.component'
import {RoleAvatarComponent} from './pages/users/role-avatar.component'

import {UserManagerPage} from './pages/users/user-manager.page'
import {UserPermissionEditorComponent} from './pages/users/user-permission-editor.component'
import {UserComponent} from './pages/users/user.component'
//noinspection ES6PreferShortImport
import {UserListItemDemo} from './pages/users/user.demo'

import {FirebaseAdminService} from '@tangential/authorization-service'
import {PluginsPage} from './pages/plugins/plugins.page'


@NgModule({
  declarations: [
    AdminConsoleParentPage,
    RoleAvatarComponent,
    UserPermissionEditorComponent,
    UserListItemDemo,
    PermissionComponent,
    RoleComponent,
    UserComponent,
    PluginsPage,
    PermissionManagerPage,
    RoleManagerPage,
    UserManagerPage,
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatGridListModule,
    MatMenuModule,
    MatToolbarModule,
    MatCheckboxModule,
    MatButtonToggleModule,

    TanjComponentsModule,
    /* Routing */
    AdminConsoleRoutingModule,
    MatTableModule,
    MatSortModule
  ],
  providers:    [
    {provide: AdminService, useClass: FirebaseAdminService}
  ]

})
export class TanjAdminConsoleModule {

}
