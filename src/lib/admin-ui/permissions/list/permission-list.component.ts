import {Component, ChangeDetectionStrategy, Input, EventEmitter, Output, OnChanges, SimpleChange} from "@angular/core";
import {OMap} from "@tangential/common";
import {AuthPermission} from "@tangential/media-types";


@Component({
  selector: 'tg-permission-list-component',
  templateUrl: 'permission-list.component.html',
  styleUrls: ['permission-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PermissionListComponent implements OnChanges {

  @Input() permissions: OMap<string, AuthPermission> = new OMap<string, AuthPermission>()

  @Output() addPermission: EventEmitter<AuthPermission> = new EventEmitter<AuthPermission>(false)
  @Output() permissionChange: EventEmitter<AuthPermission> = new EventEmitter<AuthPermission>(false)
  @Output() removePermission: EventEmitter<AuthPermission> = new EventEmitter<AuthPermission>(false)

  private _tempIdx: number = 0

  constructor() {
  }

  ngOnChanges(changes:{permissions:SimpleChange}) {
  }

  onRemovePermission(permission: AuthPermission) {
    this.removePermission.emit(permission)
  }

  onChange(permission: AuthPermission) {
    this.permissionChange.emit(permission)
  }

  doAddPermission() {
    let permission: AuthPermission = new AuthPermission ({
      $key: this._nextName("Permission"),
      description: "",
      orderIndex: this.permissions[this.permissions.length - 1].orderIndex + 1
    })
    this.addPermission.emit(permission)
  }

  _nextName(name: string) {
    while (this._nameExists(name + ' ' + (++this._tempIdx))) {
    }
    return name + ' ' + this._tempIdx
  }

  _nameExists(name: string) {
    return this.permissions.has(name)
  }

}
