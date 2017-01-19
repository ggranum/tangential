import {Component, ChangeDetectionStrategy, Input, EventEmitter, Output, OnChanges} from "@angular/core";
import {OMap} from "@tangential/common";
import {AuthUser, AuthRole, AuthPermission} from "@tangential/media-types";


@Component({
  selector: 'tg-user-list-component',
  templateUrl: 'user-list.component.html',
  styleUrls: ['user-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserListComponent implements OnChanges {

  @Input() allUsers: OMap<string, AuthUser> = new OMap<string, AuthUser>()
  @Input() allRoles: OMap<string, AuthRole> = new OMap<string, AuthRole>()
  @Input() allPermissions: OMap<string, AuthPermission> = new OMap<string, AuthPermission>()

  @Output() addUser: EventEmitter<AuthUser> = new EventEmitter<AuthUser>(false)
  @Output() userChange: EventEmitter<AuthUser> = new EventEmitter<AuthUser>(false)
  @Output() removeUser: EventEmitter<AuthUser> = new EventEmitter<AuthUser>(false)

  constructor() { }

  ngOnChanges(change:any) {

  }

  onRemoveUser(user: AuthUser) {
    this.removeUser.emit(user)
  }

  onChange(user: AuthUser) {
    if (user.$key) {
      this.userChange.emit(user)
    } else {
      this.addUser.emit(user)
    }
  }

  doAddUser() {
    let user: AuthUser = new AuthUser({
      createdMils: Date.now(),
      email: '',
      displayName: ''
    })
    this.addUser.emit(user)
  }

}
