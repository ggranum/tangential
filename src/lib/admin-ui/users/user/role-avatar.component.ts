import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter, SimpleChange
} from "@angular/core";
import {MdButtonToggleChange} from "@angular/material";
import {AuthRole} from "@tangential/media-types";


@Component({
  selector: 'tg-role-avatar',
  template: `
<div>
<md-button-toggle  [checked]="active" (change)="doChange($event)">{{role.$key}}</md-button-toggle>
</div>
`,
  styleUrls: ['user.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoleAvatarComponent {

  @Input() role: AuthRole
  @Input() active: boolean = false

  @Output() change: EventEmitter<boolean> = new EventEmitter<boolean>(false);

  constructor() {}

  ngOnChanges(changes:{role:SimpleChange, active:SimpleChange}){
    console.log('RoleAvatarComponent', 'ngChanges', JSON.stringify(changes))
  }

  doChange(event:MdButtonToggleChange){
    this.active = event.source.checked
    this.change.emit(this.active)
  }


}
