import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, ViewEncapsulation} from '@angular/core'
import {AuthPermission, AuthRole, AuthUser, AuthUserIF} from '@tangential/authorization-service'
import {Observable} from 'rxjs/Observable'

@Component({
  selector:        'tanj-user',
  templateUrl:     './user.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation:   ViewEncapsulation.None
})
export class UserComponent implements OnChanges {

  @Input() user: AuthUser
  @Input() userRoles: AuthRole[] = []
  @Input() userGrantedPermissions: AuthPermission[] = []
  @Input() userRolePermissions: AuthPermission[] = []

  @Input() showSelector: boolean = true
  @Input() selected: boolean = false
  @Input() expanded: boolean = false

  @Output() change: Observable<AuthUserIF>;
  @Output() selectionChange: EventEmitter<boolean> = new EventEmitter<boolean>(false)
  @Output() removeUser: EventEmitter<AuthUser> = new EventEmitter<AuthUser>(false)
  @Output() addUserRole: EventEmitter<{ user: AuthUser, role: AuthRole }> = new EventEmitter<{ user: AuthUser, role: AuthRole }>(false)
  @Output() removeUserRole: EventEmitter<{ user: AuthUser, role: AuthRole }> = new EventEmitter<{ user: AuthUser, role: AuthRole }>(false)
  @Output() addUserPermission: EventEmitter<{ user: AuthUser, permission: AuthPermission }> =
    new EventEmitter<{ user: AuthUser, permission: AuthPermission }>(false)
  @Output() removeUserPermission: EventEmitter<{ user: AuthUser, permission: AuthPermission }> =
    new EventEmitter<{ user: AuthUser, permission: AuthPermission }>(false)


  private _focusDebouncer: EventEmitter<boolean> = new EventEmitter<boolean>(false);

  @Output() focus: Observable<Event>
  @Output() blur: Observable<Event>

  submitted = false;
  private _changed: boolean

  constructor() {
    let distinct: Observable<boolean> = this._focusDebouncer.asObservable()
    distinct = distinct.debounceTime(10).distinctUntilChanged()

    this.focus = distinct
      .filter((focused) => focused === true)
      .map(() => {
        this.expanded = true
        return new Event('focus')
      })

    this.change = distinct
      .filter((focused) => focused === false && this._changed)
      .map(() => this.user)

    this.blur = distinct
      .filter((focused) => focused === false)
      .map(() => new Event('blur'))
  }

  ngOnChanges(change: any) {
    if (change.user_roles) {
      // console.log('UserListItemComponent', 'ngOnChanges', this.roles)
      // debugger
    }
  }

  fireRemoveUser() {
    this.removeUser.emit(this.user)
  }

  doToggleRole(role: AuthRole, enabled: boolean) {
    if (enabled) {
      this.addUserRole.emit({user: this.user, role: role})
    } else {
      this.removeUserRole.emit({user: this.user, role: role})
    }
  }

  doTogglePermission(permission: AuthPermission) {
    const event = {user: this.user, permission: permission};
    if (this.userGrantedPermissions.some((item) => item.$key === permission.$key)) {
      this.removeUserPermission.emit(event)
    } else {
      this.addUserPermission.emit(event)
    }
  }

  doToggleSelected() {
    this.selected = !this.selected
    this.selectionChange.emit(this.selected)
  }


  onChange() {
    this._changed = true
  }

  onBlur() {
    this._focusDebouncer.emit(false)
  }

  onFocus() {
    this._focusDebouncer.emit(true)

  }

  onSubmit() {
    console.log('UserComponent', 'onSubmit')
    this.submitted = true;
  }
}
