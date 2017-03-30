import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  HostBinding
} from '@angular/core'
import {
  VisitorService,
  SignInState
} from "@tangential/authorization-service";
import { AuthUser } from "@tangential/media-types";
import {
  Observable,
  BehaviorSubject
} from "rxjs";
import {AuthInfo} from "@tangential/sign-in-panel";

@Component({
  selector: 'tgd-sign-in-page',
  host: {},
  template: `<div flex  class="tg-sign-in-page"  layout="column" layout-align="center center">
  <md-card flex *ngIf="signedOut$ | async" layout="row" layout-align="center">
    <tg-sign-in-panel
      [preventSubmit]="true"
      [username]="'bob@example.com'"
      [displayMode]="signIn"
      [requireEmailUsername]="true"
      (signIn)="onSignIn($event)"
      (signUp)="onSignUp($event)"
      (forgotPassword)="onForgotPassword($event)">
    </tg-sign-in-panel>
  </md-card>
  </div>`,
  styles:[
  `
.tg-sign-in-page md-card {
    min-height: 30em;
   max-width: 35em;
}

.tg-sign-in-page {
  padding-bottom: 5em;
}

`
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class SignInPageComponent {

  @HostBinding('attr.flex') flex = '';
  @HostBinding('attr.layout') layout = 'column';
  @HostBinding('attr.layout-align') layoutAlign = 'start';

  visitorName$: Observable<string>
  signedOut$: Observable<boolean>
  actionPerformed: string

  constructor(private _visitorService: VisitorService) {
  }

  ngOnInit() {
    let subject = new BehaviorSubject(true)
    this.signedOut$ = subject.asObservable()
    this._visitorService.signInState$().subscribe((state) => {
      let v = !(state == SignInState.signedIn || state == SignInState.signingUp)
      subject.next(v)
    })
    this.visitorName$ = this._visitorService.signOnObserver().map((visitor: AuthUser) => {
      return visitor ? visitor.email : 'Anonymous'
    })
  }

  onSignIn(authInfo: AuthInfo) {
    this._visitorService.signInWithEmailAndPassword({
      email: authInfo.username,
      password: authInfo.password
    }).then(() => {
      // console.log('SignInPageComponent', 'sign-in successful')
    }).catch(() => {
      console.log('SignInPageComponent', 'sign-in failed')
    })
  }

  onSignUp(authInfo: AuthInfo) {
    this._visitorService.createUserWithEmailAndPassword({
      email: authInfo.username,
      password: authInfo.password
    }).then((user) => {
      // console.log('SignInPageComponent', 'sign-up successful: userId=', user.$key)
    }).catch(() => {
      console.log('SignInPageComponent', 'sign-up failed')
    })
  }

  onForgotPassword(authInfo: AuthInfo) {
    this.actionPerformed = "You have attempted to request a forgotten password."
    // console.log('SignInPanelDemo', 'onForgotPassword', authInfo)
  }

}

