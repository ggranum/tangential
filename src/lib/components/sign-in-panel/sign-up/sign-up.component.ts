import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostBinding,
  Input,
  Output,
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
  selector:        'tanj-sign-up',
  templateUrl:     './sign-up.component.html',
  encapsulation:   ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignUpComponent {

  @HostBinding('attr.layout') flexLayout = 'column';
  @HostBinding('attr.layout-align') flexLayoutAlign = 'start center';

  @Input() username: string
  @Input() requireEmailUsername: boolean
  @Input() preventSubmit: boolean = false

  @Output() authChange: EventEmitter<ChangeEvent<AuthInfo>> = new EventEmitter<ChangeEvent<AuthInfo>>(false)
  @Output() signUp: EventEmitter<AuthInfo> = new EventEmitter<AuthInfo>(false)
  @Output() showSignInRequest: EventEmitter<AuthInfo> = new EventEmitter<AuthInfo>(false)

  prevAuthInfo: AuthInfo
  authInfo: AuthInfo

  constructor(public changeDetectorRef: ChangeDetectorRef) {
    this.authInfo = {
      action:    SignInActions.signUp,
      username:  '',
      password:  '',
      password2: '',
    }
  }

  onSubmit(event) {
  }

  onShowSignInRequest() {
    this.showSignInRequest.next()
  }


  onAuthChange() {
    const next: AuthInfo = Object.assign(this.authInfo)
    this.authChange.emit({
      previous: this.prevAuthInfo,
      current:  next
    })
    this.prevAuthInfo = next
  }

  onSignUpRequest(event: Event, form: NgForm) {
    if (form.valid) {
      if (this.preventSubmit) {
        event.preventDefault()
      }
      this.signUp.emit(this.authInfo)
    } else {
      console.error('Shouldn\'t be able to perform this action when the form is invalid.')
    }
  }


}
