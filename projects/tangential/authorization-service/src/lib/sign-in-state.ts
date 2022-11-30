export type SignInState =
  'unknown' |
  'guest' |
  'signedOut' |
  'signingIn' |
  'signedIn' |
  'signedInAnonymous' |
  'signInFailed' |
  'signingOut' |
  'signingUp' |
  'newAccount' |
  'signUpFailed'

export const SignInStates = {
  unknown:           <SignInState>'unknown',
  guest:             <SignInState>'guest',
  signedOut:         <SignInState>'signedOut',
  signingIn:         <SignInState>'signingIn',
  signedIn:          <SignInState>'signedIn',
  signedInAnonymous: <SignInState>'signedInAnonymous',
  signInFailed:      <SignInState>'signInFailed',
  signingOut:        <SignInState>'signingOut',
  signingUp:         <SignInState>'signingUp',
  newAccount:        <SignInState>'newAccount',
  signUpFailed:      <SignInState>'signUpFailed',
}

