import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostBinding,
  Input,
  OnInit,
  Output,
  ViewEncapsulation
} from '@angular/core'
import {NgForm} from '@angular/forms'
import {Hacks} from '@tangential/core'
import {AuthInfo, SignInActions} from '../sign-in/sign-in.component'


@Component({
  selector:        'tanj-password-reset',
  templateUrl:     './password-reset.component.html',
  encapsulation:   ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasswordResetComponent implements OnInit {


  @HostBinding('attr.layout') flexLayout = 'column'
  @HostBinding('attr.layout-align') flexLayoutAlign = 'start center'

  @Input() username: string
  @Input() requireEmailUsername: boolean
  @Input() preventSubmit: boolean = false

  @Output() forgotPasswordEmailRequest: EventEmitter<AuthInfo> = new EventEmitter<AuthInfo>(false)
  @Output() showSignInRequest: EventEmitter<AuthInfo> = new EventEmitter<AuthInfo>(false)

  constructor(private changeDetectorRef: ChangeDetectorRef) {
  }


  ngOnInit() {
    Hacks.materialDesignPlaceholderText(this.changeDetectorRef)
  }

  onSubmit(event) {
  }

  onShowSignInRequest() {
    this.showSignInRequest.next({
      username: this.username,
      action: SignInActions.signIn,
    })
  }

  onForgotPasswordRequest(event: Event, form: NgForm) {
    if (form.valid) {
      if (this.preventSubmit) {
        event.preventDefault()
      }
      this.forgotPasswordEmailRequest.emit({
        username: this.username,
        action:   SignInActions.forgotPassword
      })
    } else {
      console.error('Shouldn\'t be able to perform this action when the form is invalid.')
    }
  }

}
