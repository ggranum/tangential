import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation
} from '@angular/core'
import {
  Params,
  Router,
  ActivatedRoute
} from "@angular/router";
import {
  SignInState
} from "@tangential/authorization-service";
import {Observable} from "rxjs";
import {AuthUserIF} from "@tangential/media-types";

@Component({
  selector: 'tang-sign-in-panel-page',
  template: `
<div class='sign-in-page-content' layout="row" layout-align="center start">
  <tang-sign-in-panel ></tang-sign-in-panel>
</div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class SignInPanelPage {
  private redirectTo: string

  signInState$: Observable<SignInState>
  user$: Observable<AuthUserIF>

  constructor(private route: ActivatedRoute, private router: Router) {
    // this.signInState$ = _store.select((s: AuthStoreState) => safe(() => s.auth.transient.signInState))
    // this.user$ = _store.select((s: AuthStoreState) => safe(() => s.auth.transient.visitor))
  }


  ngOnInit() {
    this.route.params.forEach((params: Params) => {
      this.redirectTo = params['redirect']
    });

    let sub = this.signInState$.subscribe((signInState: SignInState) => {
        if (signInState == SignInState.signedIn) {
          if (sub) {
            sub.unsubscribe()
          }
          this.onSignInSuccess()
        }
      }
    )
  }

  onSignInSuccess(){
    this.router.navigate([this.redirectTo || '/'])
  }
}
