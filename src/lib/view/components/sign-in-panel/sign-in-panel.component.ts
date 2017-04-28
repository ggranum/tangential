import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChange,
  ViewContainerRef,
  ViewEncapsulation
} from '@angular/core'
import {ChangeEvent} from '@tangential/core'

export type SignInAction = 'signUp' | 'signIn' | 'forgotPassword'
export const SignInActions = {
  signUp: <SignInAction>'signUp', signIn: <SignInAction>'signIn', forgotPassword: <SignInAction>'forgotPassword',
}

export interface AuthInfo {
  username: string
  password?: string
  password2?: string
  rememberMe?: boolean
  action: SignInAction
}


@Component({
  selector:        'tanj-sign-in-panel',
  templateUrl:     './sign-in-panel.component.html',
  encapsulation:   ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignInPanelComponent implements OnChanges {

  @Input() username: string
  @Input() requireEmailUsername: boolean
  @Input() displayMode: SignInAction = SignInActions.signIn
  @Input() preventSubmit: boolean = false

  @Output() authChange: EventEmitter<ChangeEvent<AuthInfo>> = new EventEmitter<ChangeEvent<AuthInfo>>(false)
  @Output() signIn: EventEmitter<AuthInfo> = new EventEmitter<AuthInfo>(false)
  @Output() signUp: EventEmitter<AuthInfo> = new EventEmitter<AuthInfo>(false)
  @Output() forgotPassword: EventEmitter<AuthInfo> = new EventEmitter<AuthInfo>(false)

  authInfo: AuthInfo

  signInActions = SignInActions

  constructor(private viewRef: ViewContainerRef, public changeDetectorRef: ChangeDetectorRef) {
    this.authInfo = {
      action: null, username: '', password: '', password2: '', rememberMe: true
    }
  }

  ngOnChanges(change: { displayMode: SimpleChange, username: SimpleChange }) {
    if (change.displayMode) {
      this.authInfo.action = this.displayMode || SignInActions.signIn
    }
    if (change.username) {
      this.authInfo.username = this.username
    }
    setTimeout(() => {
      // material design placeholder issue.
      this.changeDetectorRef.markForCheck()
    }, 50)
  }

  onAuthChange(change: ChangeEvent<AuthInfo>) {
    const previous = Object.assign({}, this.authInfo)
    Object.assign(this.authInfo, change.current)
    this.authChange.emit({current: this.authInfo, previous: previous})
  }

  setDisplayMode(mode: SignInAction) {
    this.authInfo.action = mode
  }

}
