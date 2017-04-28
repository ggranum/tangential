import {ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Router} from '@angular/router';
import {AuthInfo} from '@tangential/components';
import {Visitor, VisitorService} from '@tangential/visitor-service';
import {Observable} from 'rxjs/Observable';
import {AppRoutes} from '../../../app.routing.module';

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
export class SignUpPage implements OnInit {

  visitorName$: Observable<string>
  showForm$: Observable<boolean>

  constructor(private router: Router,
              private visitorService: VisitorService) {
  }

  ngOnInit() {
    this.showForm$ = this.visitorService.visitor$().map((visitor) => {
      return visitor.isGuest() || visitor.isAnonymous()
    })
    this.visitorName$ = this.visitorService.awaitVisitor$().map((visitor: Visitor) => {
      return visitor.displayName()
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
        if (visitor.isAnonymous()) {
          promise = this.visitorService.linkAnonymousAccount(visitor.authUser, credentials)
        } else {
          promise = this.visitorService.createUserWithEmailAndPassword(credentials)
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

