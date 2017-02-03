import {Component, OnInit, ChangeDetectionStrategy} from "@angular/core";
import {AuthUser, AuthRole, AuthPermission} from "@tangential/media-types";
import {VisitorService, SignInState} from "@tangential/authorization-service";
// if the firebase-config.local file doesn't exist then you still need to run 'gulp firebase:init-project
// see the docs regarding preparing Firebase.
import {Observable} from "rxjs";


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
