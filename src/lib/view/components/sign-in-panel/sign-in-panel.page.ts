import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewEncapsulation
} from '@angular/core'
import {
  ActivatedRoute,
  Params,
  Router
} from '@angular/router'
import {
  AuthService,
  AuthUserIF,
  SignInState,
  SignInStates
} from '@tangential/authorization-service'
import {Observable} from 'rxjs/Observable'

@Component({
  selector: 'tanj-sign-in-panel-page',
  template: `
              <div class='sign-in-page-content' layout="row" layout-align="center start">
                <tanj-sign-in-panel></tanj-sign-in-panel>
              </div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class SignInPanelPage implements OnInit {
  private redirectTo: string

  signInState$: Observable<SignInState>
  visitor$: Observable<AuthUserIF>

  constructor(private route: ActivatedRoute, private router: Router, private _visitorService: AuthService) {
  }


  ngOnInit() {
    this.signInState$ = this._visitorService.signInState$()
    this.visitor$ = this._visitorService.authUser$()

    this.route.params.forEach((params: Params) => {
      this.redirectTo = params['redirect']
    });

    const sub = this.signInState$.subscribe((signInState: SignInState) => {
      if (signInState === SignInStates.signedIn) {
        if (sub) {
          sub.unsubscribe()
        }
        this.onSignInSuccess()
      }
    })
  }

  onSignInSuccess() {
    this.router.navigate([this.redirectTo || '/'])
  }
}
