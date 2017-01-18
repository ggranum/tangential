import {Component, ChangeDetectionStrategy, Input, EventEmitter, Output, OnChanges} from "@angular/core";
import {OMap} from "@tangential/common";
import {AuthRole, AuthPermission} from "@tangential/media-types";


@Component({
  selector: 'tang-role-list-component',
  templateUrl: 'role-list.component.html',
  styleUrls: ['role-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoleListComponent implements OnChanges {

  @Input() roles: OMap<string, AuthRole> = new OMap<string, AuthRole>()
  @Input() permissions: OMap<string, AuthPermission> = new OMap<string, AuthPermission>()

  @Output() addRole: EventEmitter<AuthRole> = new EventEmitter<AuthRole>(false)
  @Output() roleChange: EventEmitter<AuthRole> = new EventEmitter<AuthRole>(false)
  @Output() removeRole: EventEmitter<AuthRole> = new EventEmitter<AuthRole>(false)


  private _tempIdx = 0

  constructor() { }

  ngOnChanges(change: any) {
  }

  onRemoveRole(role: AuthRole) {
    this.removeRole.emit(role)
  }

  onChange(role: AuthRole) {
    this.roleChange.emit(role)
  }

  doAddRole() {
    let role: AuthRole = new AuthRole({
      $key: this._nextName("Role"),
      description: "",
      orderIndex: this.roles[this.roles.length - 1].orderIndex + 1
    })
    this.addRole.emit(role)
  }

  _nextName(name: string) {
    while (this._nameExists(name + ' ' + (++this._tempIdx))) {
    }
    return name + ' ' + this._tempIdx
  }

  _nameExists(name: string) {
    return this.roles.valuesAry().some((role: AuthRole) => {
      return role.$key == name
    })
  }


}
