import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter
} from "@angular/core";
import {AuthPermission, AuthUser} from "@tangential/media-types";
import {ObjMap} from "@tangential/common";


@Component({
  selector: 'tang-user-permission-editor',
  template: `
<button  md-raised-button
  *ngIf="permission"
 color="{{getColor()}}"
(click)="doChange($event)" 
[class.tang-explicitly-granted]="isExplicitlyGranted()"
>{{permission.$key}}</button>
`,
  styleUrls: ['user.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserPermissionEditorComponent {

  @Input() user: AuthUser
  @Input() permission: AuthPermission
  @Input() userGrantedPermissions: ObjMap<boolean> = {}
  @Input() userEffectivePermissions: ObjMap<boolean> = {}

  @Output() change: EventEmitter<Event> = new EventEmitter<Event>(false);

  constructor() {
  }

  doChange(event: Event) {
    console.log('UserPermissionEditorComponent', 'doChange')
    this.change.emit(event)
  }

  getColor(): string {
    let color = this.isGranted() ? 'primary' : null
    if (this.isExplicitlyGranted()) {
      color = 'accent'
    }
    return color
  }

  isGranted(): boolean {
    return !!this.userEffectivePermissions[this.permission.$key]
  }

  isExplicitlyGranted() {
    return !!this.userGrantedPermissions[this.permission.$key]
  }
}
