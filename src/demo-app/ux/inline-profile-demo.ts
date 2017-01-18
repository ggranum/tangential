import {Component} from '@angular/core';

import {AuthUserIF} from "@tangential/media-types";
import {SignInState} from "@tangential/authorization-service";


@Component({
  selector: 'inline-profile-demo',
  templateUrl: 'inline-profile-demo.html',
  styleUrls: ['inline-profile-demo.scss'],
})
export class InlineProfileDemo {
  user:AuthUserIF = {
    createdMils: Date.now(),
    disabled: false,
    displayName: "Joe User",
    email: "joe.user@example.com",
    $key: "101"
  }
  signInState:number = SignInState.signedIn
}
