import {Component, NgModule, Optional, SkipSelf, OnInit} from "@angular/core";
import {CommonModule} from "@angular/common";
import {AuthUser, AuthRole, AuthPermission} from "@tangential/media-types";
import {OMap} from "@tangential/common";
import {FirebaseProvider} from "@tangential/firebase";
import {
  AuthorizationServiceModule,
  FirebaseUserService,
  UserService,
  FirebaseRoleService,
  RoleService,
  FirebasePermissionService,
  PermissionService, FirebaseVisitorService, VisitorService
} from "@tangential/authorization-service";

import {AdminUiModule} from "@tangential/admin-ui";
// if the firebase-config.local file doesn't exist then you still need to run 'gulp firebase:init-project
// see the docs regarding preparing Firebase.
import {firebaseConfig} from "../../../config/authorization-service/firebase-config.local";

import {defaultUsers} from '../../../config/authorization-service/basic-defaults/users.local'


@Component({
  selector: 'authorization-service-demo',
  templateUrl: 'authorization-service-demo.html',
  styleUrls: ['authorization-service-demo.scss'],
})
export class AuthorizationServiceDemo implements OnInit {

  visitor: AuthUser
  visitorRoles: OMap<string, AuthRole>
  visitorGrantedPermissions: OMap<string, AuthPermission>
  visitorEffectivePermissions: OMap<string, AuthPermission>

  constructor(private _visitorService: VisitorService,
              private _permissionService: PermissionService,
              private _roleService: RoleService,
              private _userService: UserService) {
    console.log('AuthorizationServiceDemo', 'constructor')

  }

  ngOnInit() {
    console.log('AuthorizationServiceDemo', 'ngOnInit')
    let tries = 0
    this._visitorService.signOnObserver().subscribe((visitor) => {
      this.visitor = visitor
      if (visitor) {
        this._userService.getPermissionsForUser(visitor).subscribe((permissions) => {
          this.visitorGrantedPermissions = OMap.fromKeyedEntityArray(permissions)
          this.visitorEffectivePermissions = this.visitorGrantedPermissions
        })
        this._userService.getRolesForUser(visitor).subscribe((roles) => {
          this.visitorRoles = OMap.fromKeyedEntityArray(roles)
        })
      }
      else if (tries++ < 2) {
        let loginCfg = defaultUsers[0]
        this._visitorService.signInWithEmailAndPassword(loginCfg).catch((reason)=>{
          console.log('AuthorizationServiceDemo', 'Login Failed', reason)
        })
      }
    })
  }
}





// const defaultsProvider = new DefaultAuthorizationDefaultsProvider();
// const defaultAuthorizationModel = defaultsProvider.getDefaultAuthorizationModel();


@NgModule({
  declarations: [
    AuthorizationServiceDemo
  ],
  imports: [
    CommonModule,
    AuthorizationServiceModule,
    AdminUiModule
  ],
  providers: [
    {provide: FirebaseProvider, useValue: new FirebaseProvider(firebaseConfig)},
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
        'AuthModule is already loaded. Import it in the AppModule only')
    }
  }
}
