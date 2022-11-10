import {ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Router} from '@angular/router';
import {AuthenticationService, Visitor, VisitorService} from '@tangential/authorization-service';
import {AuthInfo, NotificationIF, NotificationMessage} from '@tangential/components';
import {CodedError, DefaultPageAnalytics, Logger, MessageBus, Page, RouteInfo} from '@tangential/core';
import {FirebaseErrors} from '@tangential/firebase-util';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators'
import {AppRouteDefinitions} from '../../../app.routes.definitions'

@Component({
  selector: 'tanj-sign-in-page',
  template: `
              <tanj-page-body>
                <tanj-sign-in
                  *ngIf="signedOut$ | async"
                  [preventSubmit]="true"
                  [username]=""
                  [requireEmailUsername]="true"
                  (signIn)="onSignIn($event)"
                  (showSignUpRequest)="onShowSignUpRequest()"
                  (showPasswordResetRequest)="onShowPasswordResetRequest()">
                </tanj-sign-in>
              </tanj-page-body>`,
  styles: [
      `
      tanj-sign-in-page tanj-sign-in {
        margin-top : 3em;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class SignInPage extends Page implements OnInit {

  routeInfo: RouteInfo = {
    page:      {
      title: 'Tangential: Sign In'
    },
    analytics: DefaultPageAnalytics(),
    showAds:   false
  }
  signedOut$: Observable<boolean>
  visitorName$: Observable<string>

  constructor(protected bus: MessageBus,
              protected logger: Logger,
              private router: Router,
              private authService: AuthenticationService,
              private visitorService: VisitorService) {
    super(bus)
  }

  ngOnInit() {
    this.signedOut$ = this.visitorService.visitor$().pipe(
      map((visitor) => {
        return visitor.subject.isGuest()
      }))
    this.visitorName$ = this.visitorService.awaitVisitor$().pipe(
      map((visitor: Visitor) => {
        return visitor.subject.displayName
      }))
  }

  onSignIn(authInfo: AuthInfo) {
    this.authService.signInWithEmailAndPassword({
      email:    authInfo.username,
      password: authInfo.password
    }).then(() => {
      this.logger.trace(this, '#onSignIn', 'signed in, navigate to captures list.')
      this.router.navigate(['/'])
    }).catch((err: CodedError) => {
      const notice: NotificationIF = {}
      if (err.code === FirebaseErrors.invalidEmail) {
        notice.message = `Sign in failed: username is not a valid email address`
      } else if (err.code === FirebaseErrors.userNotFound) {
        notice.message = `Sign in failed: check your username`
      } else if (err.code === FirebaseErrors.badPassword) {
        notice.message = `Sign in failed: bad password`
      } else {
        notice.message = 'Sign in failed and we don\'t know why! Our apologies. Please try again later.'
      }
      this.bus.post(NotificationMessage.warning(notice))
      console.log('SignInPageComponent', 'sign-in failed', err)
    })
  }

  onShowSignUpRequest() {
    this.router.navigate(AppRouteDefinitions.signIn.navTargets.absToSignUp())
  }

  onShowPasswordResetRequest() {
    this.router.navigate(AppRouteDefinitions.signIn.navTargets.absToPasswordReset())
  }

}

