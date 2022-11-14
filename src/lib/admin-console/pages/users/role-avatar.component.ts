import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChange} from '@angular/core'
import {MatButtonToggleChange} from '@angular/material/button-toggle'
import {AuthRole} from '@tangential/authorization-service'


@Component({
  selector:        'tanj-role-avatar',
  template:        `
                     <div>
                       <mat-button-toggle [checked]="active" (change)="doChange($event)">{{role.$key}}</mat-button-toggle>
                     </div>
                   `,
  styleUrls:       ['./_user.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoleAvatarComponent implements OnChanges {

  @Input() role: AuthRole
  @Input() active: boolean = false

  @Output() change: EventEmitter<boolean> = new EventEmitter<boolean>(false);

  constructor() {
  }

  ngOnChanges(changes: { role: SimpleChange, active: SimpleChange }) {
    console.log('RoleAvatarComponent', 'ngChanges', JSON.stringify(changes))
  }

  doChange(event: MatButtonToggleChange) {
    this.active = event.source.checked
    this.change.emit(this.active)
  }


}
