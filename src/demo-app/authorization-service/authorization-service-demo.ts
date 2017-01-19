import {
  Component, NgModule, Optional, SkipSelf, OnInit, Input, OnChanges,
  ChangeDetectionStrategy
} from "@angular/core";
import {CommonModule} from "@angular/common";
import {AuthUser, AuthRole, AuthPermission} from "@tangential/media-types";
import {OMap} from "@tangential/common";
import {FirebaseProvider, FirebaseConfig} from "@tangential/firebase";
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

import { SharedModule, DataTableModule} from "primeng/primeng";
import {Observable} from "rxjs";


@Component({
  selector: 'authorization-service-demo-container',
  template: `<authorization-service-demo
  [visitor]="visitor$ | async"
  [visitorEffectivePermissions]="visitorEffectivePermissions$ | async"
  [wtf]="count"
  
  ></authorization-service-demo>`,
  styleUrls: ['authorization-service-demo.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthorizationServiceDemoContainer implements OnInit {

  visitor$: Observable<AuthUser>
  visitorEffectivePermissions$: Observable<AuthPermission[]>

  count:number = 0
  constructor(private _visitorService: VisitorService) {
  }

  ngOnInit(): void {
    this.visitor$ = this._visitorService.signOnObserver().map((visitor) => {
      console.log('AuthorizationServiceDemoContainer', 'Visitor', this.count++, visitor)
      return this.count === 0 ? null : visitor
    })
    this.visitorEffectivePermissions$ = this.visitor$.flatMap((visitor) => {
      return this._visitorService.getEffectivePermissions$().map((permissions: AuthPermission[]) => {
        console.log('AuthorizationServiceDemoContainer', 'Effective Permissions for user', permissions)
        return OMap.fromKeyedEntityArray(permissions).valuesAry()
      })
    })
  }

}
@Component({
  selector: 'authorization-service-demo',
  templateUrl: 'authorization-service-demo.html',
  styleUrls: ['authorization-service-demo.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class AuthorizationServiceDemo implements OnChanges {

  @Input() visitor: AuthUser
  @Input() visitorEffectivePermissions: AuthPermission[]
  @Input() wtf: number
  visitorRoles: OMap<string, AuthRole>
  visitorGrantedPermissions: OMap<string, AuthPermission>

  constructor(private _visitorService: VisitorService,
              private _permissionService: PermissionService,
              private _roleService: RoleService,
              private _userService: UserService) {
    console.log('AuthorizationServiceDemo', 'constructor')

  }

  ngOnChanges(changes: any) {
    console.log('AuthorizationServiceDemo', 'ngOnChanges', JSON.stringify(changes, null, 2))
    if (changes.visitor && this.visitor) {
      this._visitorService.getGrantedPermissions$().subscribe((permissions: AuthPermission[]) => {
        console.log('AuthorizationServiceDemo', 'Granted Permissions for user', permissions)
        this.visitorGrantedPermissions = OMap.fromKeyedEntityArray(permissions)
      })
      this._visitorService.getRoles$().subscribe((roles: AuthRole[]) => {
        console.log('AuthorizationServiceDemo', 'Roles for user', roles)
        this.visitorRoles = OMap.fromKeyedEntityArray(roles)
      })
      // else if (tries++ < 2) {
      //   let loginCfg = defaultUsers[0]
      //   this._visitorService.signInWithEmailAndPassword(loginCfg).catch((reason) => {
      //     console.log('AuthorizationServiceDemo', 'Login Failed', reason)
      //   })
      // }
    }
  }
}


export const firebaseProvider = () => new FirebaseProvider(firebaseConfig);

@NgModule({
  declarations: [
    AuthorizationServiceDemo,
    AuthorizationServiceDemoContainer,
  ],
  imports: [
    CommonModule,
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
        'AuthModule is already loaded. Import it in the AppModule only')
    }
  }
}
