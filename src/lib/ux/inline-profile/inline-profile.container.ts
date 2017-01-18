import {NgModule} from '@angular/core'


import {CommonModule} from '@angular/common'
import {FormsModule} from '@angular/forms'

import {MdButtonModule} from '@angular/material/button/button'
import {MdIconModule} from '@angular/material/icon/icon'
import {MdInputModule} from '@angular/material/input/input'

import {Component, ChangeDetectionStrategy, Input} from '@angular/core'

import {SignInStates, SignInState} from '@tangential/authorization-service'
import {InlineProfileComponent} from "./inline-profile.component";
import {Observable} from "rxjs";
import {AuthUserIF} from "@tangential/media-types";

// @revisit: There seems to be a bug. Using the /authorization-service/index target for import causes Injection to fail.
// import {} from '@tangential/authorization-service';


@Component({
  selector: 'tang-inline-profile-container',
  template: `<tang-inline-profile-component 
      [user]="user | async"
      [signInState]="signInState | async"></tang-inline-profile-component>`,
  styleUrls: ['../inline-login-form/inline-login-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InlineProfileContainer {

  signInState: Observable<SignInState>
  user: AuthUserIF

  constructor() { }


  isSignedIn(signInState: SignInState) {
    return signInState.state == SignInStates.signedIn
  }

  doSignOut() { }
}


@NgModule({
  declarations: [
    InlineProfileContainer,
    InlineProfileComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    MdButtonModule,

    MdIconModule,
    MdInputModule
  ],
  exports: [
    InlineProfileContainer,
    InlineProfileComponent
  ]
})
export class InlineProfileModule {

}
