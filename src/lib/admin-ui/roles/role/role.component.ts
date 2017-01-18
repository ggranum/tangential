import {Component, ChangeDetectionStrategy, Input, Output, EventEmitter, OnChanges, SimpleChange} from "@angular/core";
import {Observable} from "rxjs";
import {AuthPermission, AuthRole} from "@tangential/media-types";
import {OMap} from "@tangential/common";


@Component({
  selector: 'tang-role-component',
  templateUrl: 'role.component.html',
  styleUrls: ['role.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoleComponent implements OnChanges {

  @Input() role: AuthRole
  @Input() rolePermissions: OMap<string, AuthPermission> = new OMap<string, AuthPermission>()
  @Input() permissions: OMap<string, AuthPermission> = new OMap<string, AuthPermission>()
  @Input() collapsed: boolean = true

  @Output() change: Observable<{current: AuthRole, previous: AuthRole}>
  @Output() removeRole: EventEmitter<AuthRole> = new EventEmitter<AuthRole>(false)

  private _focusDebouncer: EventEmitter<boolean> = new EventEmitter<boolean>(false);

  @Output() addRolePermission: EventEmitter<{role: AuthRole, permission: AuthPermission}>
    = new EventEmitter<{role: AuthRole, permission: AuthPermission}>(false)
  @Output() removeRolePermission: EventEmitter<{role: AuthRole, permission: AuthPermission}>
    = new EventEmitter<{role: AuthRole, permission: AuthPermission}>(false)
  @Output() focus: Observable<Event>
  @Output() blur: Observable<Event>


  submitted = false;
  private _changed: boolean
  private _previous: AuthRole


  constructor() {
    let distinct: Observable<boolean> = this._focusDebouncer.asObservable()
    distinct = distinct.debounceTime(10).distinctUntilChanged()

    this.focus = distinct
      .filter((focused) => focused === true)
      .map(() => {
        return new Event('focus')
      })

    this.blur = distinct
      .filter((focused) => focused === false)
      .map(() => {
        return new Event('blur')
      })

    this.change = distinct
      .filter((focused) => focused === false && this._changed)
      .map(() => {
        this.collapsed = false

        let change = {
          previous: this._previous,
          current: this.role
        }
        this._previous = new AuthRole(this.role)
        this._changed = false
        return change
      })


  }

  ngOnChanges(changes: {role: SimpleChange, permissions: SimpleChange}) {
    if (changes.role) {
      this._previous = new AuthRole(this.role)
      this._changed = false
      if (this.role.$key.endsWith("2")) {
        debugger
      }
    }
    if (this.role && this.role.$key == "Administrator" && changes.permissions && changes.permissions.currentValue) {
      // debugger
    }
  }

  doRemoveRole() {
    console.log('RoleComponent', 'doRemoveRole')
    this.removeRole.emit(this.role)
  }

  onChange(event: Event) {
    event.stopPropagation()
    this._changed = true
  }

  onBlur(event: Event) {
    event.stopPropagation()
    this._focusDebouncer.emit(false)
  }

  onFocus(event: Event) {
    event.stopPropagation()
    this._focusDebouncer.emit(true)

  }

  onSubmit() {
    console.log("RoleComponent", "onSubmit")
    this.submitted = true;
  }

  doTogglePermission(permission: AuthPermission) {
    let rolePermission: {role:AuthRole, permission:AuthPermission} = {
      permission: permission,
      role: this.role
    }
    if (this.rolePermissions.has(permission.$key)) {
      console.log('RoleComponent', 'doTogglePermission-remove')
      this.removeRolePermission.emit(rolePermission)
    } else {
      console.log('RoleComponent', 'doTogglePermission-add')
      this.addRolePermission.emit(rolePermission)
    }
  }

}
