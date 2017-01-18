import {Component, ChangeDetectionStrategy, Input, EventEmitter, Output} from "@angular/core";
import {Observable} from "rxjs";
import {AuthPermission} from "@tangential/media-types";


@Component({
  selector: 'tang-permission',
  template: ` 
 <tang-permission-component flex layout="row" layout-align="start"
               [permission]="permission"
               (change)="change.emit($event)"
               (removePermission)="removePermission.emit($event)"
               (focus)="focus.emit($event)"
               (blur)="blur.emit($event)"
      ></tang-permission-component>
`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PermissionContainer {

  @Input() permission: AuthPermission = new AuthPermission({})

  @Output() change: Observable<AuthPermission> = new EventEmitter<AuthPermission>(false)
  @Output() removePermission: EventEmitter<AuthPermission> = new EventEmitter<AuthPermission>(false)


  @Output() focus: EventEmitter<Event> = new EventEmitter<Event>(false)
  @Output() blur: EventEmitter<Event> = new EventEmitter<Event>(false)

  constructor() { }


}

