import {
  Component,
  ChangeDetectionStrategy,
  Input,
  EventEmitter,
  Output,
  ViewEncapsulation,
  OnInit,
  OnChanges,
  SimpleChange
} from "@angular/core";
import {Observable} from "rxjs";
import {UserService, RoleService} from "@tangential/authorization-service";
import {AuthUser, AuthPermission, AuthRole} from "@tangential/media-types";
import {OMap, ObjMapUtil} from "@tangential/common";

/**
 * View for a single user within a list of users.
 */
@Component({
  selector: 'tang-user',
  template: ` 
 <tang-user-component
               flex layout="row" layout-align="start"
               [user]="user"
               [userRoles]="userRoles | async"
               [userGrantedPermissions]="userGrantedPermissions  | async"
               [userRolePermissions]="userGrantedPermissions  | async"
               (change)="change.emit($event)"
               (addUserRole)="onAddUserRole($event)"
               (removeUserRole)="onRemoveUserRole($event)"
               (addUserPermission)="onAddUserPermission($event)"
               (removeUserPermission)="onRemoveUserPermission($event)"
               (removeUser)="removeUser.emit($event)"
               (focus)="focus.emit($event)"
               (blur)="blur.emit($event)"
      ></tang-user-component>
`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class UserListItemContainer implements OnInit, OnChanges {

  @Input() user: AuthUser
  @Input() allRoles: OMap<string, AuthRole>
  @Input() allPermissions: OMap<string, AuthPermission>

  userRoles: Observable<OMap<string, AuthRole>>
  userGrantedPermissions: Observable<OMap<string, AuthPermission>>
  userRolePermissions: Observable<OMap<string, AuthPermission>>

  @Output() change: EventEmitter<AuthUser> = new EventEmitter<AuthUser>(false)
  @Output() removeUser: EventEmitter<AuthUser> = new EventEmitter<AuthUser>(false)


  @Output() focus: EventEmitter<Event> = new EventEmitter<Event>(false)
  @Output() blur: EventEmitter<Event> = new EventEmitter<Event>(false)

  constructor(private userService: UserService, private roleService: RoleService) {
  }

  ngOnInit(): void {
  }


  ngOnChanges(changes: {user: SimpleChange}): void {
    if (changes.user) {
      this.userRoles = this.userService.getRolesForUser$(this.user).map((roles) => OMap.fromKeyedEntityArray(roles))
      this.userGrantedPermissions = this.userService.getPermissionsForUser(this.user).map((permissions) => OMap.fromKeyedEntityArray(permissions))
      this.userRolePermissions = this.userRoles.mergeMap((userRoles) => {
        return Observable.from(userRoles.valuesAry()).flatMap((userRole: AuthRole) => {
          return this.roleService.getPermissionsForRole$(userRole)
        }).reduce((acc:AuthPermission[], rolePermissions:AuthPermission[]) =>{
          return acc.concat(rolePermissions)
        }, []).map((rolePermissions:AuthPermission[]) => OMap.fromKeyedEntityArray(rolePermissions))
      })
    }
  }

  onAddUserRole(userRole: {user: AuthUser, role: AuthRole}) {
    this.userService.grantRole(userRole.user, userRole.role).then(() => this.change.emit(userRole.user))
  }

  onRemoveUserRole(userRole: {user: AuthUser, role: AuthRole}) {
    this.userService.revokeRole(userRole.user, userRole.role).then(() => this.change.emit(userRole.user))
  }

  onAddUserPermission(userPermission: {user: AuthUser, permission: AuthPermission}) {
    this.userService.grantPermission(userPermission.user, userPermission.permission).then(() => this.change.emit(userPermission.user))
  }

  onRemoveUserPermission(userPermission: {user: AuthUser, permission: AuthPermission}) {
    this.userService.revokePermission(userPermission.user, userPermission.permission).then(() => this.change.emit(userPermission.user))
  }

}
