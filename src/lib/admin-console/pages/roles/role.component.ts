import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChange, ViewEncapsulation} from '@angular/core'
import {AuthPermission, AuthRole} from '@tangential/authorization-service'
import {Observable} from 'rxjs'
import {debounceTime, distinctUntilChanged, filter, map} from 'rxjs/operators'


@Component({
  selector:        'tanj-role',
  templateUrl:     './role.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation:   ViewEncapsulation.None
})
export class RoleComponent implements OnChanges {


  @Input() role: AuthRole
  @Input() allPermissions: AuthPermission[]
  @Input() rolePermissions: AuthPermission[]
  @Input() collapsed: boolean = true

  @Output() change: Observable<{ current: AuthRole, previous: AuthRole }>
  @Output() remove: EventEmitter<AuthRole> = new EventEmitter<AuthRole>(false)

  private _focusDebouncer: EventEmitter<boolean> = new EventEmitter<boolean>(false);

  @Output() addRolePermission: EventEmitter<{ role: AuthRole, permission: AuthPermission }>
    = new EventEmitter<{ role: AuthRole, permission: AuthPermission }>(false)
  @Output() removeRolePermission: EventEmitter<{ role: AuthRole, permission: AuthPermission }>
    = new EventEmitter<{ role: AuthRole, permission: AuthPermission }>(false)
  @Output() focus: Observable<Event>
  @Output() blur: Observable<Event>


  submitted: boolean = false;
  private _changed: boolean
  private _previous: AuthRole


  constructor() {
    let distinct: Observable<boolean> = this._focusDebouncer.asObservable()
    distinct = distinct.pipe(debounceTime(10), distinctUntilChanged())

    this.focus = distinct.pipe(
      filter((focused) => focused === true),
      map(() => {
        return new Event('focus')
      }))

    this.blur = distinct.pipe(
      filter((focused) => focused === false),
      map(() => {
        return new Event('blur')
      }))

    this.change = distinct.pipe(
      filter((focused) => focused === false && this._changed),
      map(() => {
        this.collapsed = false

        const change = {
          previous: this._previous,
          current:  this.role
        }
        this._previous = AuthRole.from(this.role)
        this._changed = false
        return change
      }))
  }

  ngOnChanges(changes: { role: SimpleChange, permissions: SimpleChange }) {
    if (changes.role) {
      this._previous = AuthRole.from(this.role)
      this._changed = false
    }
  }

  fireRemove() {
    this.remove.emit(this.role)
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
    this.submitted = true;
  }

  hasPermission(perm: AuthPermission) {
    return this.rolePermissions.some(rolePerm => rolePerm.$key === perm.$key)
  }

  doTogglePermission(permission: AuthPermission) {
    const rolePermission: { role: AuthRole, permission: AuthPermission } = {
      permission: permission,
      role:       this.role
    }
    if (this.rolePermissions.some(entry => entry.$key === permission.$key)) {
      this.removeRolePermission.emit(rolePermission)
    } else {
      this.addRolePermission.emit(rolePermission)
    }
  }
}
