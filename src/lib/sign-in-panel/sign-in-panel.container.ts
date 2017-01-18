import {
  Component,
  ChangeDetectionStrategy,
  Input,
  ViewEncapsulation,
} from '@angular/core'
import {Observable} from 'rxjs'
import {AuthInfo} from "./sign-in-panel.component";
import {AuthUserIF} from "@tangential/media-types";


@Component({
  selector: 'tang-sign-in-panel',
  template: `<tang-sign-in-panel-component
  [username]="username"
  (signIn)="onSignIn($event)"
  (signUp)="onSignUp($event)"
  (forgotPassword)="onForgotPassword($event)"

  [preventSubmit]="true"
  [displayMode]="signIn"
  [requireEmailUsername]="true"
>

</tang-sign-in-panel-component>`,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignInPanelContainer {

  @Input() username: string = ""
  @Input() requireEmailUsername: boolean

  user$: Observable<AuthUserIF>

  constructor() {
    // this.user$ = _store.select((s: AuthStoreState) => safe(() => s.auth.transient.visitor))
  }

  onSignIn(authInfo: AuthInfo) {

  }

  onSignUp(authInfo: AuthInfo) {

  }

  onForgotPassword(authInfo: AuthInfo) {
    console.log('SignInPanelDemo', 'onForgotPassword', authInfo)
  }
}
