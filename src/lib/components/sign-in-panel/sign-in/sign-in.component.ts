import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostBinding,
  Input,
  OnChanges,
  Output,
  SimpleChange,
  ViewEncapsulation
} from '@angular/core'
import {NgForm} from '@angular/forms'
import {ChangeEvent} from '@tangential/core'
//noinspection TypeScriptPreferShortImport
import {
  AuthInfo,
  SignInActions
} from '../sign-in-panel.component'

@Component({
  selector:        'tanj-sign-in',
  templateUrl:     './sign-in.component.html',
  encapsulation:   ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignInComponent implements OnChanges {


  @HostBinding('attr.layout') flexLayout = 'column'
  @HostBinding('attr.layout-align') flexLayoutAlign = 'start center';

  @Input() username: string
  @Input() requireEmailUsername: boolean
  @Input() preventSubmit: boolean = false

  @Output() authChange: EventEmitter<ChangeEvent<AuthInfo>> = new EventEmitter<ChangeEvent<AuthInfo>>(false)

  @Output() signIn: EventEmitter<AuthInfo> = new EventEmitter<AuthInfo>(false)

  @Output() showSignUpRequest: EventEmitter<AuthInfo> = new EventEmitter<AuthInfo>(false)
  @Output() showPasswordResetRequest: EventEmitter<AuthInfo> = new EventEmitter<AuthInfo>(false)

  prevAuthInfo: AuthInfo
  authInfo: AuthInfo

  constructor() {

    this.authInfo = {
      action: SignInActions.signIn, username: '', password: '', rememberMe: true
    }
  }

  ngOnChanges(changes: { username: SimpleChange }) {
    if (changes.username) {
      this.authInfo.username = this.username
    }
  }

  onSubmit(event) {
  }

  /**
   * @revisit ggranum: There's a valid argument in favor of providing the validity/error state along with the change.
   */
  onAuthChange() {
    const next: AuthInfo = Object.assign(this.authInfo)
    this.authChange.emit({previous: this.prevAuthInfo, current: next})
    this.prevAuthInfo = next
  }

  onSignInRequest(event: Event, form: NgForm) {
    if (form.valid) {
      if (this.preventSubmit) {
        event.preventDefault()
      }
      this.signIn.emit(this.authInfo)
    } else {
      console.error('Shouldn\'t be able to perform this action when the form is invalid.')
    }
  }

  onShowForgotPasswordRequest() {
    this.showPasswordResetRequest.next()
  }

  onShowSignUpRequest() {
    console.log('SignInComponent', 'onShowSignUpRequest')
    this.showSignUpRequest.next()
  }

}
