import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation
} from '@angular/core'
import {AuthInfo} from "./sign-in-panel.component";
import {VisitorService} from "@tangential/authorization-service";
import {AuthUser} from "@tangential/media-types";
import {Observable} from "rxjs";

@Component({
  selector: 'tg-sign-in-panel-demo',
  template: `<h1>Login Panel Demo</h1>
<h3>Open your browsers debug console to view log messages related to various actions.</h3>
<div fxFlex class='tg-demo-content' fxLayout="column" fxLayoutAlign="start">
  <span style="font-weight: bolder">You are currently signed in as: {{visitorName$ | async}}</span>
  <span style="font-weight: bolder;margin-bottom: 2em;">This form does not actually attempt to perform a sign in action.</span>
  <md-card fxFlex="35em" fxLayout="row">
    <tg-sign-in-panel fxFlex
      [preventSubmit]="true"
      [username]="'bob@example.com'"
      [displayMode]="signIn"
      [requireEmailUsername]="true"
      (signIn)="onSignIn($event)"
      (signUp)="onSignUp($event)"
      (forgotPassword)="onForgotPassword($event)">
    </tg-sign-in-panel>
  </md-card>
  <h4>{{actionPerformed}}</h4>
</div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class SignInPanelDemo {

  visitorName$: Observable<string>
  actionPerformed: string

  constructor(private _visitorService: VisitorService) {

  }

  ngOnInit() {
    this.visitorName$ = this._visitorService.signOnObserver().map((visitor: AuthUser) => {
      return visitor ? visitor.email : 'Anonymous'
    })
  }

  onSignIn(authInfo: AuthInfo) {
    this.actionPerformed = `You attempted to sign in as ${authInfo.username}`
    console.log('SignInPanelDemo', 'onSignIn', authInfo)
  }

  onSignUp(authInfo: AuthInfo) {
    this.actionPerformed = `You attempted to sign up as ${authInfo.username}`
    console.log('SignInPanelDemo', 'onSignUp', authInfo)
  }

  onForgotPassword(authInfo: AuthInfo) {
    this.actionPerformed = "You have attempted to request a forgotten password."
    console.log('SignInPanelDemo', 'onForgotPassword', authInfo)
  }

}

