import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewEncapsulation} from '@angular/core'
import {AuthPermission, AuthUser} from '@tangential/authorization-service'
import {ObjMap} from '@tangential/core'


@Component({
  selector:        'tanj-user-permission-editor',
  template:        `
                     <button mat-raised-button
                             *ngIf="permission"
                             color="{{getColor()}}"
                             (click)="doChange($event)"
                             [class.tanj-explicitly-granted]="isExplicitlyGranted()"
                     >{{permission.$key}}
                     </button>
                   `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation:   ViewEncapsulation.None
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
    return this.userEffectivePermissions[this.permission.$key]
  }

  isExplicitlyGranted() {
    return this.userGrantedPermissions[this.permission.$key]
  }
}
