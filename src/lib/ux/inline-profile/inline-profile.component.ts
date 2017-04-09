import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  NgModule,
  Output,
  ViewEncapsulation
} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";

import {MdButtonModule, MdIconModule, MdInputModule} from "@angular/material";


import {AuthUserIF} from "@tangential/media-types";
import {SignInState} from "@tangential/authorization-service";

@Component({
  selector: 'tg-inline-profile-component',
  templateUrl: 'inline-profile.component.html',
  styleUrls: ['./inline-profile.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class InlineProfileComponent {

  @Input() signInState: SignInState = SignInState.unknown
  @Input() user: AuthUserIF
  showAccountFlyout: boolean = false
  logoutButtonLabel: string = "Sign Out"

  @Output() signOut:EventEmitter<string> = new EventEmitter<string>(false)

  constructor() {  }

  isSignedIn(signInState: SignInState) {
    return signInState == SignInState.signedIn
  }

  dismiss($event:any){
    this.showAccountFlyout = false
  }

  fireSignOutEvent(){
    this.signOut.emit(this.user.$key)
  }
}




@NgModule({
  declarations: [
    InlineProfileComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    MdButtonModule,

    MdIconModule,
    MdInputModule
  ],
  exports: [
    InlineProfileComponent
  ]
})
export class InlineProfileModule {}
