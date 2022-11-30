import {
  AuthenticationService,
  EmailPasswordCredentials,
  SignInStates,
} from '../index';
import {Logger, MessageBus} from '@tangential/core';
import {first, firstValueFrom} from 'rxjs'
import {filter} from 'rxjs/operators'
import {TestConfiguration} from '../state/test-config.spec';

export type TestEntry = [string, (done) => void]

export abstract class BaseAuthenticationRequiredTestSet {


  constructor(public description:string,
              protected testConfiguration: TestConfiguration,
              protected bus: MessageBus,
              protected logger: Logger,
              protected authService: AuthenticationService) {
  }


  handleFailure(e:Error){
    console.log('PermissionsTestSet', 'handleFailure', e.message)
    fail(e)
  }

  abstract declareTests():TestEntry[]

  beforeEach(): Promise<void> {
    return this.signInIfRequired(this.testConfiguration.adminCredentials)
  }

  afterEach(): Promise<void> {
    return Promise.resolve()
  }

  signInIfRequired(credentials: EmailPasswordCredentials): Promise<void> {
    return firstValueFrom(this.authService.authSubject$().pipe(filter(subject => subject.signInState != SignInStates.unknown)))
      .then(subject => {
        if (subject.email != credentials.email) {
          return this.authService.signInWithEmailAndPassword(credentials)
        } else {
          /** @todo: What is the actual correct behaviour if sign in not required? */
          throw "Sign in not required."
        }
      })
  }

  cleanup():Promise<void> {
    return this.signInIfRequired(this.testConfiguration.adminCredentials).then(() => {
      firstValueFrom(this.authService.awaitKnownAuthSubject$()).then(user => {
        console.log('Signed in for cleanup', user.$key)

      })
    }).catch((reason) => {
      console.error('Could not sign in as admin', reason)
    })
  }
}
