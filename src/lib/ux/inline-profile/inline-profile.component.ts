import {Component, ChangeDetectionStrategy, Input, ViewEncapsulation} from "@angular/core";
import {AuthUserIF} from "@tangential/media-types";
import {SignInState} from "@tangential/authorization-service";

@Component({
  selector: 'tang-inline-profile-component',
  templateUrl: 'inline-profile.component.html',
  styleUrls: ['./inline-profile.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class InlineProfileComponent {

  @Input() signInState: SignInState = 0
  @Input() user: AuthUserIF



  logoutButtonLabel: string = "Sign Out"
  showAccountFlyout: boolean = false

  constructor() {

  }

  isSignedIn(signInState: any) {
    return signInState.state == 30
  }

  signOut() {

  }

  dismiss($event){
    this.showAccountFlyout = false
  }
}
