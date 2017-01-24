import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation
} from '@angular/core'
import {AuthInfo} from "./sign-in-panel.component";

@Component({
  selector: 'tg-sign-in-panel-demo',
  template: `<h1>Login Panel Demo</h1>
<h3>Open your browsers debug console to view log messages related to various actions.</h3>
<div class='demo-content' layout="row" layout-align="center start">
  <tg-sign-in-panel-component 
    [preventSubmit]="true"
    [username]="'bob@example.com'"
    [displayMode]="signIn"
    [requireEmailUsername]="true"
    (signIn)="onSignIn($event)"
    (signUp)="onSignUp($event)"
    (signForgotPassword)="onForgotPassword($event)"
    >
    
</tg-sign-in-panel-component>
</div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class SignInPanelDemo {

  onSignIn(authInfo: AuthInfo){
    console.log('SignInPanelDemo', 'onSignIn', authInfo)
  }

  onSignUp(authInfo: AuthInfo){
    console.log('SignInPanelDemo', 'onSignUp', authInfo)
  }

  onForgotPassword(authInfo: AuthInfo){
    console.log('SignInPanelDemo', 'onForgotPassword', authInfo)
  }

}

