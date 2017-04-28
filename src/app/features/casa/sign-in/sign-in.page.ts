import {ChangeDetectionStrategy, Component, HostBinding, OnInit, ViewEncapsulation} from '@angular/core'
import {Router} from '@angular/router'
import {AuthInfo} from '@tangential/components'
import {CodedError, Logger, MessageBus} from '@tangential/core'
import {FirebaseErrors} from '@tangential/firebase-util'
import {Visitor, VisitorService} from '@tangential/visitor-service'
import {Observable} from 'rxjs/Observable'
import {AppRoutes} from '../../../app.routing.module'
import {NotificationIF, NotificationMessage} from '../../common/notification-bar-component/notification'

@Component({
  selector: 'tanj-sign-in-page',
  template: `<tanj-page-body>
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
        margin-top: 3em;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class SignInPage implements OnInit {

  @HostBinding('class.tanj-page-component') page = true;

  visitorName$: Observable<string>
  signedOut$: Observable<boolean>

  constructor(private router: Router,
              private bus: MessageBus,
              private visitorService: VisitorService) {
  }

  ngOnInit() {
    this.signedOut$ = this.visitorService.visitor$().map((visitor) => {
      return visitor.isGuest()
    })
    this.visitorName$ = this.visitorService.awaitVisitor$().map((visitor: Visitor) => {
      return visitor.displayName()
    })
  }

  onSignIn(authInfo: AuthInfo) {
    this.visitorService.signInWithEmailAndPassword({
      email:    authInfo.username,
      password: authInfo.password
    }).then(() => {
      Logger.trace(this.bus, this, '#onSignIn', 'signed in, navigate to captures list.')
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
    this.router.navigate(AppRoutes.signIn.navTargets.absToSignUp())
  }

  onShowPasswordResetRequest() {
    this.router.navigate(AppRoutes.signIn.navTargets.absToPasswordReset())
  }

}

