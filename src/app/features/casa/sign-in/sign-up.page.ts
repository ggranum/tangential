import {ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Router} from '@angular/router';
import {AuthenticationService, Visitor, VisitorService} from '@tangential/authorization-service';
import {AuthInfo} from '@tangential/components';
import {DefaultPageAnalytics, MessageBus, Page, RouteInfo} from '@tangential/core';
import {Observable} from 'rxjs';
import {first, map} from 'rxjs/operators'
import {AppRouteDefinitions} from '../../../app.routes.definitions'

@Component({
  selector: 'tanj-sign-up-page',
  template: `
              <tanj-page-body>
                <tanj-sign-up
                  *ngIf="showForm$ | async"
                  [preventSubmit]="true"
                  [username]=""
                  [requireEmailUsername]="true"
                  (signUp)="onSignUp($event)"
                  (showSignInRequest)="onShowSignInRequest()">
                </tanj-sign-up>
              </tanj-page-body>`,
  styles: [
      `
      tanj-sign-up-page tanj-sign-up {
        margin-top : 3em;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class SignUpPage extends Page implements OnInit {

  routeInfo: RouteInfo = {
    page:      {
      title: 'Tangential: Register'
    },
    analytics: DefaultPageAnalytics(),
    showAds:   false
  }
  showForm$: Observable<boolean>
  visitorName$: Observable<string>

  constructor(protected bus: MessageBus,
              private router: Router,
              private authService: AuthenticationService,
              private visitorService: VisitorService) {
    super(bus)
  }

  ngOnInit() {
    this.showForm$ = this.visitorService.visitor$().pipe(
      map((visitor) => {
        return visitor.subject.isGuest() || visitor.subject.isAnonymousAccount()
      }))
    this.visitorName$ = this.visitorService.awaitVisitor$().pipe(
      map((visitor: Visitor) => {
        return visitor.subject.displayName
      }))
  }

  onSignUp(authInfo: AuthInfo) {
    const credentials = {
      email:    authInfo.username,
      password: authInfo.password
    }
    this.visitorService.awaitVisitor$().pipe(first()).subscribe({
      next: (visitor) => {
        let promise: Promise<any>
        if (visitor.subject.isAnonymousAccount()) {
          promise = this.authService.linkAnonymousAccount(credentials)
        } else {
          promise = this.authService.createUserWithEmailAndPassword(credentials)
        }
        promise.then(() => {
          this.router.navigate(['/'])
        }).catch((e) => {
          console.log('SignUpPageComponent', 'sign-up failed', e)
        })
      }
    })
  }

  onShowSignInRequest() {
    this.router.navigate(AppRouteDefinitions.signUp.navTargets.absToSignIn())
  }

}

