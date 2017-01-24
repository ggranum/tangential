import {
  Component, NgModule, Optional, SkipSelf, OnInit, Input, OnChanges,
  ChangeDetectionStrategy, LOCALE_ID, Inject
} from "@angular/core";
import {CommonModule, DatePipe} from "@angular/common";
import {AuthUser, AuthRole, AuthPermission, EmailPasswordCredentials} from "@tangential/media-types";
import {OMap} from "@tangential/common";
import {FirebaseProvider, FirebaseConfig} from "@tangential/firebase";
import {
  AuthorizationServiceModule,
  FirebaseUserService,
  UserService,
  FirebaseRoleService,
  RoleService,
  FirebasePermissionService,
  PermissionService, FirebaseVisitorService, VisitorService, SignInState
} from "@tangential/authorization-service";

import {AdminUiModule} from "@tangential/admin-ui";
// if the firebase-config.local file doesn't exist then you still need to run 'gulp firebase:init-project
// see the docs regarding preparing Firebase.
import {firebaseConfig} from "../../../config/authorization-service/firebase-config.local";

import {SharedModule, DataTableModule} from "primeng/primeng";
import {Observable} from "rxjs";
import {InlineProfileModule} from "@tangential/inline-profile"
import {InlineLoginFormModule} from "@tangential/inline-login-form"




@Component({
  selector: 'authorization-service-demo-container',
  template: `<authorization-service-demo
  [visitor]="visitor$ | async"
  [signInState]="signInState$ | async"
  [visitorRoles]="visitorRoles$ | async" 
  [visitorGrantedPermissions]="visitorGrantedPermissions$ | async" 
  [visitorEffectivePermissions]="visitorEffectivePermissions$ | async"></authorization-service-demo>`,
  styleUrls: ['authorization-service-demo.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthorizationServiceDemoContainer implements OnInit {

  visitor$: Observable<AuthUser>
  signInState$: Observable<SignInState>
  visitorRoles$: Observable<AuthRole[]>
  visitorGrantedPermissions$: Observable<AuthPermission[]>
  visitorEffectivePermissions$: Observable<AuthPermission[]>

  constructor(private _visitorService: VisitorService) {
  }

  ngOnInit(): void {
    this.signInState$ = this._visitorService.signInState$().map((state) => {
      console.log('AuthorizationServiceDemoContainer', 'signInState', state)
      return state
    })
    this.visitor$ = this._visitorService.signOnObserver().map((visitor) => {
      console.log('AuthorizationServiceDemoContainer', 'Visitor', visitor)
      return visitor
    })
    this.visitorRoles$ = this.visitor$.flatMap((visitor) => {
      return this._visitorService.getRoles$().map((roles: AuthRole[]) => {
        console.log('AuthorizationServiceDemoContainer', 'Roles for user', roles.length)
        return roles
      })
    })
    this.visitorGrantedPermissions$ = this.visitor$.flatMap((visitor) => {
      return this._visitorService.getGrantedPermissions$().map((permissions: AuthPermission[]) => {
        console.log('AuthorizationServiceDemoContainer', 'Granted Permissions for user', permissions.length)
        return permissions
      })
    })
    this.visitorEffectivePermissions$ = this.visitor$.flatMap((visitor) => {
      return this._visitorService.getEffectivePermissions$().map((permissions: AuthPermission[]) => {
        console.log('AuthorizationServiceDemoContainer', 'Effective Permissions for user', permissions.length)
        return permissions
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
  @Input() visitorRoles: AuthRole[]
  @Input() visitorGrantedPermissions: AuthPermission[]
  @Input() visitorEffectivePermissions: AuthPermission[]
  @Input() signInState: SignInState

  visitorTableColumns: any[]
  visitorTableValues: {colOne: string, colTwo: any}[] = [
    {colOne: "User Id", colTwo: 'Not Signed In'}
  ]

  constructor(private _visitorService: VisitorService, @Inject(LOCALE_ID) private _locale: string) {

    console.log('AuthorizationServiceDemo', 'constructor', _locale)
    this.visitorTableColumns = [
      {field: "colOne", header: " - "},
      {field: "colTwo", header: " - "}
    ]

    this.visitorTableValues = []

  }

  ngOnChanges(changes: any) {
    if (changes.visitor && this.visitor) {
      let datePipe = new DatePipe(this._locale)
      this.visitorTableValues = [
        {colOne: "User Id", colTwo: this.visitor.$key},
        {colOne: "Display Name", colTwo: this.visitor.displayName},
        {colOne: "Created", colTwo: datePipe.transform(this.visitor.createdMils)},
        {colOne: "Disabled", colTwo: this.visitor.disabled},
        {colOne: "Email", colTwo: this.visitor.email},
        {colOne: "Email Verified", colTwo: this.visitor.$key},
        {colOne: "Is Anonymous", colTwo: this.visitor.isAnonymous},
        {colOne: "Last Sign In IP", colTwo: this.visitor.lastSignInIp},
        {colOne: "Last Sign In", colTwo: datePipe.transform(this.visitor.lastSignInMils)},
        {colOne: "PhotoURL", colTwo: this.visitor.photoURL}
      ]
    }
    if (changes.signInState) {
      console.log('AuthorizationServiceDemo', 'ngOnChanges signInState', this.signInState)
    }
  }

  onSignOut() {
    console.log('AuthorizationServiceDemo', 'onSignOut')
    this._visitorService.signOut().then(() => {
      console.log('AuthorizationServiceDemo', 'Signed out')
    })
  }

  onSignIn(event: EmailPasswordCredentials) {
    console.log('AuthorizationServiceDemo', 'onSignIn', event)
    this._visitorService.signInWithEmailAndPassword(event).then((user) => {
      console.log('AuthorizationServiceDemo', 'signed in as', user)
    })
  }

  onSignUp(event: EmailPasswordCredentials) {
    console.log('AuthorizationServiceDemo', 'onSignUp', event)
  }


}


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
