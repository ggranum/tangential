import {Component, ChangeDetectionStrategy, Input} from '@angular/core'
import {SignInState} from '@tangential/authorization-service';


@Component({
  selector: 'tang-inline-login-form-component',
  templateUrl: 'inline-login-form.component.html',
  styleUrls: ['inline-login-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InlineLoginFormComponent {

  @Input() signInState: SignInState
  @Input() errorMessage: string

  username: string
  password: string

  usernameFieldLabel: string = "email"
  passwordFieldLabel: string = "password"
  loginButtonLabel: string = "Sign In"
  signupButtonLabel: string = "Sign Up"

  constructor() {
  }

  isSignedOut(signInState: SignInState) {
    return signInState == SignInState.signedOut
  }

  isSigningUp(signInState: SignInState) {
    return signInState == SignInState.signingUp
  }

  isUnknownState(signInState: SignInState) {
    return signInState == SignInState.unknown
  }

  doLoginAction(event: Event) {
    event.preventDefault()
    event.stopPropagation()
    // this._store.dispatch(VisitorActions.signIn.invoke.action({email: this.username, password: this.password}))
  }

  doSignupAction() {
    // this._store.dispatch(VisitorActions.signUp.invoke.action({email: this.username, password: this.password}))
  }

  onSubmit(event: Event) {
    event.preventDefault()
    event.stopPropagation()
  }
}
