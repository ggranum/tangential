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
  SignInState, VisitorService
} from "@tangential/authorization-service";
import {Observable} from "rxjs";
import {AuthUserIF} from "@tangential/media-types";

@Component({
  selector: 'tg-sign-in-panel-page',
  template: `
    <div class='sign-in-page-content' fxLayout="row" fxLayoutAlign="center start">
      <tg-sign-in-panel ></tg-sign-in-panel>
    </div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class SignInPanelPage {
  private redirectTo: string

  signInState$: Observable<SignInState>
  visitor$: Observable<AuthUserIF>

  constructor(private route: ActivatedRoute, private router: Router, private _visitorService: VisitorService) {}


  ngOnInit() {
    this.signInState$ = this._visitorService.signInState$()
    this.visitor$ = this._visitorService.signOnObserver()

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

  onSignInSuccess() {
    this.router.navigate([this.redirectTo || '/'])
  }
}
