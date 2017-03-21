import {NgModule, Optional, SkipSelf} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FirebaseProvider, FirebaseConfig} from "@tangential/firebase-util";
import {
  AuthorizationServiceModule,
  FirebaseUserService,
  UserService,
  FirebaseRoleService,
  RoleService,
  FirebasePermissionService,
  PermissionService,
  FirebaseVisitorService,
  VisitorService
} from "@tangential/authorization-service";
import {AdminUiModule} from "@tangential/admin-ui";
// if the firebase-config.local file doesn't exist then you still need to run 'gulp firebase:init-project
// see the docs regarding preparing Firebase.
import {firebaseConfig} from "../../../lib/authorization-service/config/firebase-config.local";
import {SharedModule, DataTableModule} from "primeng/primeng";
import {InlineProfileModule} from "@tangential/inline-profile";
import {InlineLoginFormModule} from "@tangential/inline-login-form";
import {AuthorizationServiceDemo} from "./authorization-service-demo";
import {AuthorizationServiceDemoContainer} from "./authorization-service-demo.container";


@NgModule({
  declarations: [
    AuthorizationServiceDemo,
    AuthorizationServiceDemoContainer,
  ],
  imports: [
    CommonModule,
    InlineProfileModule,
    InlineLoginFormModule,
    AuthorizationServiceModule,
    AdminUiModule,
    SharedModule,
    DataTableModule
  ],
  providers: [
    {provide: FirebaseConfig, useValue: firebaseConfig},
    {provide: FirebaseProvider, useClass: FirebaseProvider},
    {provide: PermissionService, useClass: FirebasePermissionService},
    {provide: RoleService, useClass: FirebaseRoleService},
    {provide: UserService, useClass: FirebaseUserService},
    {provide: VisitorService, useClass: FirebaseVisitorService}

  ],
  exports: [AuthorizationServiceDemo]
})
export class AuthorizationServiceDemoModule {

  constructor(@Optional() @SkipSelf() parentModule: AuthorizationServiceDemoModule) {
    if (parentModule) {
      throw new Error(
        'AuthorizationServiceDemoModule is already loaded. Import it in the main application Module only')
    }
  }
}
