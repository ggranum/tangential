import {NgModule} from '@angular/core'

import {CommonModule} from '@angular/common'
import {FormsModule} from '@angular/forms'


import {RoleComponent} from './roles/role/role.component'

//noinspection TypeScriptPreferShortImport
import {PermissionManagerComponent} from './permissions/permission/permission-manager.component'
import {RoleManagerComponent} from './roles/role/role-manager.component'
import {PermissionComponent} from './permissions/permission/permission.component'


//noinspection TypeScriptPreferShortImport
import {UserListItemDemo} from "./users/user/user.demo";
import {UserComponent} from "./users/user/user.component";
import {RoleAvatarComponent} from "./users/user/role-avatar.component";
import {UserPermissionEditorComponent} from "./users/user/user-permission-editor.component";
import {UserManagerComponent} from "./users/user/user-manager.component";



import {DataListModule} from "@tangential/data-list";
import {DrawerModule} from "@tangential/drawer";
import {AdminPage} from "./admin.page";
import {
  MdButtonModule, MdButtonToggleModule, MdCheckboxModule, MdGridListModule, MdIconModule, MdInputModule, MdListModule,
  MdMenuModule, MdTabsModule, MdToolbarModule
} from "@angular/material";


@NgModule({
  declarations: [
    AdminPage,
    RoleAvatarComponent,
    UserPermissionEditorComponent,
    UserListItemDemo,
    PermissionComponent,
    RoleComponent,
    UserComponent,
    PermissionManagerComponent,
    RoleManagerComponent,
    UserManagerComponent,
  ],
  imports: [
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
    MdTabsModule,
    DataListModule,
    DrawerModule
  ],
  exports: [
    AdminPage,
    RoleComponent,
    UserComponent,
    PermissionManagerComponent,
    RoleManagerComponent,
    UserManagerComponent,
  ]
})
export class AdminUiModule {

}
