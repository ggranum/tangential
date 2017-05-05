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
  AuthService, AuthSubject,
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

  authSubject$: Observable<AuthSubject>

  constructor(private route: ActivatedRoute, private router: Router, private authService: AuthService) {
  }


  ngOnInit() {
    this.authSubject$ = this.authService.authSubject$()

    this.route.params.forEach((params: Params) => {
      this.redirectTo = params['redirect']
    });

    const sub = this.authSubject$.subscribe(subject => {
      if (subject.signInState === SignInStates.signedIn) {
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
