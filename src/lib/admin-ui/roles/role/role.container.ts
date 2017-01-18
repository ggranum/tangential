import {Component, ChangeDetectionStrategy, Input, EventEmitter, Output, SimpleChange} from "@angular/core";
import {Observable} from "rxjs";
import {AuthRole, AuthPermission} from "@tangential/media-types";
import {OMap} from "@tangential/common";


@Component({
  selector: 'tang-role',
  template: ` 
 <tang-role-component flex layout="row" layout-align="start"
               [role]="role"
               [permissions]="permissions"
               (change)="change.emit($event)"
               (addRolePermission)="onAddRolePermission($event)"
               (removeRolePermission)="onRemoveRolePermission($event)"
               (removeRole)="removeUser.emit($event)"
               (focus)="focus.emit($event)"
               (blur)="blur.emit($event)"
      ></tang-role-component>
`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoleContainer {

  role: AuthRole = new AuthRole({})
  @Input() roleKey: string
  @Input() permissions: OMap<string, AuthPermission> = new OMap<string, AuthPermission>()

  @Output() change: Observable<AuthRole> = new EventEmitter<AuthRole>(false)
  @Output() removeRole: EventEmitter<AuthRole> = new EventEmitter<AuthRole>(false)


  @Output() focus: EventEmitter<Event> = new EventEmitter<Event>(false)
  @Output() blur: EventEmitter<Event> = new EventEmitter<Event>(false)

  constructor() { }

  ngOnChanges(changes: {roleKey: SimpleChange}) { }

  onAddRolePermission(rolePermission: {role: AuthRole, permission:AuthPermission}) { }

  onRemoveRolePermission(rolePermission: {role: AuthRole, permission:AuthPermission}) { }

}

