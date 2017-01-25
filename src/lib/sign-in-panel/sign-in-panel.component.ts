import {
  Component,
  ChangeDetectionStrategy,
  Input,
  ViewEncapsulation,
  Output,
  EventEmitter
} from "@angular/core";
import {ChangeEvent} from "@tangential/common";
import {NgForm} from "@angular/forms";

export enum SignInAction {
  signUp = 10,
  signIn = 20,
  forgotPassword = 30,
}

export interface AuthInfo {
  username: string
  password: string
  password2?: string
  rememberMe?: boolean
  action: SignInAction
}

export interface InputResource {
  placeholder?: string
  label?: string
  error?: string
}

export interface CheckBoxResource {
  text?: string
  tip?: string
}

export interface ButtonResource {
  text?: string
  tip?: string
  error?: string
}


export interface SignInPanelResources {
  headerText: string
  subHeaderText: string
  subHeaderLinkText: string
  ledeText: string
  usernameInput: InputResource
  passwordInput?: InputResource
  password2Input?: InputResource
  rememberMe?: CheckBoxResource
  actionButton: ButtonResource
  resetPasswordText?: string
  resetPasswordLinkText?: string
}


const SIGNUP_RSRC: SignInPanelResources = {
  headerText: 'Sign up',
  subHeaderText: 'Already have an account?',
  subHeaderLinkText: 'Log in here',
  ledeText: 'Create your new account',
  usernameInput: {
    placeholder: 'Enter your email address',
    error: 'Username must be a valid email address.'
  },
  passwordInput: {
    placeholder: 'Choose a password'
  },
  password2Input: {
    placeholder: 'Verify your password',
    error: 'Passwords do not match'
  },
  actionButton: {
    text: 'Create!',
    tip: 'Create new account'
  }
}


const SIGN_IN_RSRC: SignInPanelResources = {
  headerText: 'Sign In',
  subHeaderText: "Don't have an account?",
  subHeaderLinkText: 'Sign up now',
  ledeText: 'Sign in with your email address',
  usernameInput: {
    placeholder: 'Enter your email address',
    error: 'Username must be a valid email address.'
  },
  passwordInput: {
    placeholder: 'password'
  },
  rememberMe: {
    text: 'Remember Me',
    tip: 'Save your credentials for future visits.'
  },
  resetPasswordText: "Forgot your password?",
  resetPasswordLinkText: "Click here",
  actionButton: {
    text: 'Sign In',
    tip: 'Sign in to your account'
  }
}


const FORGOT_PASSWORD_RSRC: SignInPanelResources = {
  headerText: 'Reset Password',
  subHeaderText: "Back to the",
  subHeaderLinkText: 'sign in page',
  ledeText: 'Send password reset email to:',
  usernameInput: {
    placeholder: 'Enter your email address',
    error: 'Username must be a valid email address.'
  },
  actionButton: {
    text: 'Send Reset Link',
    tip: 'Request a password reset link'
  }
}

let ResourceState:any = {}
ResourceState[SignInAction.signIn] = SIGN_IN_RSRC
ResourceState[SignInAction.signUp] = SIGNUP_RSRC
ResourceState[SignInAction.forgotPassword] = FORGOT_PASSWORD_RSRC


@Component({
  selector: 'tg-sign-in-panel',
  templateUrl: 'sign-in-panel.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignInPanelComponent {

  @Input() username: string
  @Input() requireEmailUsername: boolean
  @Input() displayMode: SignInAction = SignInAction.signIn
  @Input() preventSubmit: boolean = false

  @Output() authChange: EventEmitter<ChangeEvent<AuthInfo>> = new EventEmitter<ChangeEvent<AuthInfo>>(false)
  @Output() signIn: EventEmitter<AuthInfo> = new EventEmitter<AuthInfo>(false)
  @Output() signUp: EventEmitter<AuthInfo> = new EventEmitter<AuthInfo>(false)
  @Output() forgotPassword: EventEmitter<AuthInfo> = new EventEmitter<AuthInfo>(false)

  prevAuthInfo: AuthInfo
  authInfo: AuthInfo
  rsrc: SignInPanelResources = SIGN_IN_RSRC

  constructor() {
    this.authInfo = {
      action: null,
      username: '',
      password: '',
      password2: '',
      rememberMe: true
    }
  }

  ngOnChanges(change: any) {
    if (change['username']) {
      this.authInfo.username = this.username
    }
    if (change['displayMode']) {
      this.setDisplayMode(this.displayMode || SignInAction.signIn)
    }
  }


  isSignUpMode() {
    return this.authInfo.action == SignInAction.signUp
  }

  isSignInMode() {
    return this.authInfo.action == SignInAction.signIn
  }

  isForgotPasswordMode() {
    return this.authInfo.action == SignInAction.forgotPassword
  }


  setDisplayMode(mode: SignInAction) {
    this.authInfo.action = mode
    this.rsrc = ResourceState[mode]
  }

  onSubHeaderLinkClick(e:Event) {
    e.preventDefault();
    e.stopPropagation();
    this.cycleDisplayMode(this.authInfo.action)
  }

  onForgotPasswordModeClick() {
    this.setDisplayMode(SignInAction.forgotPassword)
  }

  /**
   * @revisit ggranum: There's a valid argument in favor of providing the validity/error state along with the change.
   */
  onAuthChange(form: NgForm) {
    let next: AuthInfo = Object.assign(this.authInfo)
    this.authChange.emit({previous: this.prevAuthInfo, current: next})
    this.prevAuthInfo = next
  }

  onActionClick(event: Event, form: NgForm) {
    if (form.valid) {
      if (this.preventSubmit) {
        event.preventDefault()
      }
      this.fireAction(this.authInfo.action)
    } else {
      console.error("Shouldn't be able to perform this action when the form is invalid.")
    }
  }

  private fireAction(action: SignInAction) {
    switch (action) {
      case SignInAction.signIn:
        this.signIn.emit(this.authInfo)
        break;
      case SignInAction.signUp:
        this.signUp.emit(this.authInfo)
        break;
      case SignInAction.forgotPassword:
        this.forgotPassword.emit(this.authInfo)
        break;
      default:
        throw new Error("Invalid display mode: " + action)
    }
  }

  forceValidityCheck(form: NgForm) {
  }

  private cycleDisplayMode(action: SignInAction) {
    switch (action) {
      case SignInAction.signIn:
        this.setDisplayMode(SignInAction.signUp);
        break;
      case SignInAction.signUp:
        this.setDisplayMode(SignInAction.signIn);
        break;
      case SignInAction.forgotPassword:
        this.setDisplayMode(SignInAction.signIn);
        break;
      default:
        throw new Error("Invalid display mode: " + action)
    }
  }

}
