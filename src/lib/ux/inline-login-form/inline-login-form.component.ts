import {Component, ChangeDetectionStrategy, Input, Output, EventEmitter} from '@angular/core'
import {SignInState} from '@tangential/authorization-service';


@Component({
  selector: 'tg-inline-login-form-component',
  templateUrl: 'inline-login-form.component.html',
  styleUrls: ['inline-login-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InlineLoginFormComponent {

  @Input() signInState: SignInState
  @Input() errorMessage: string

  @Output() signUp:EventEmitter<{email:string, password:string}> = new EventEmitter(false)
  @Output() signIn:EventEmitter<{email:string, password:string}> = new EventEmitter(false)

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

  fireLoginAction() {
    this.signIn.emit({email: this.username, password:this.password})
  }

  fireSignupAction() {
    this.signUp.emit({email: this.username, password:this.password})
  }

  onSubmit(event: Event) {
    event.preventDefault()
    event.stopPropagation()
  }
}
