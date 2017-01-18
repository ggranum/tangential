import {Component, ChangeDetectionStrategy} from '@angular/core'
import {Observable} from 'rxjs'
import {SignInState} from '@tangential/authorization-service'
import {AuthUserIF} from "@tangential/media-types";


@Component({
  selector: 'tang-inline-login-form',
  template: `
<tang-inline-login-form-component [signInState]="signInState$ | async" [errorMessage]="errorMessage | async"></tang-inline-login-form-component>
<tang-inline-profile-component [signInState]="signInState$ | async" [user]="user$ | async"></tang-inline-profile-component>
`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InlineLoginFormContainer {

  signInState$: Observable<SignInState>
  user$: Observable<AuthUserIF>
  errorMessage: Observable<string>

  constructor() {
    // this.signInState$ = _store.select((s: AuthStoreState) => safe(() => s.auth.transient.signInState))
    // this.user$ = _store.select((s: AuthStoreState) => safe(() => s.auth.transient.visitor))
  }
}
