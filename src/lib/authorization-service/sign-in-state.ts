import {RvError} from "@tangential/common";

export enum SignInState {
  unknown = 1,
  signedOut = 10,
  signingIn = 20,
  signedIn = 30,
  signedInAnonymous = 35,
  signInFailed = 40,
  signingOut = 50,
  signingUp = 60,
  newAccount = 70,
  signUpFailed = 80,
}

