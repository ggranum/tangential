import {ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Router} from '@angular/router';
import {AuthInfo} from '@tangential/components';
import {Visitor, VisitorService} from '@tangential/visitor-service';
import {Observable} from 'rxjs/Observable';
import {AppRoutes} from '../../../app.routing.module';
import {DefaultPageAnalytics, MessageBus, Page, RouteInfo} from '@tangential/core';
import {AuthService} from '@tangential/authorization-service';

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
        margin-top: 3em;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class SignUpPage extends Page implements OnInit {

  visitorName$: Observable<string>
  showForm$: Observable<boolean>

  routeInfo:RouteInfo = {
    page: {
      title: 'Tangential: Register'
    },
    analytics: DefaultPageAnalytics(),
    showAds: false
  }

  constructor(protected bus:MessageBus,
              private router: Router,
              private authService: AuthService,
              private visitorService: VisitorService) {
    super(bus)
  }

  ngOnInit() {
    this.showForm$ = this.visitorService.visitor$().map((visitor) => {
      return visitor.subject.isGuest() || visitor.subject.isAnonymous
    })
    this.visitorName$ = this.visitorService.awaitVisitor$().map((visitor: Visitor) => {
      return visitor.subject.displayName
    })
  }

  onSignUp(authInfo: AuthInfo) {
    const credentials = {
      email: authInfo.username,
      password: authInfo.password
    }
    this.visitorService.awaitVisitor$().first().subscribe({
      next: (visitor) => {
        let promise: Promise<null>
        if (visitor.subject.isAnonymous) {
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
    this.router.navigate(AppRoutes.signUp.navTargets.absToSignIn())
  }

}

