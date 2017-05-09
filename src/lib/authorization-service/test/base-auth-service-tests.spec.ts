import {
  AuthenticationService,
  EmailPasswordCredentials,
  SignInStates,
} from '@tangential/authorization-service';
import {Logger, MessageBus} from '@tangential/core';
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
    return this.authService.authSubject$().first(subject => subject.signInState != SignInStates.unknown).toPromise().then(subject => {
      if (subject.email != credentials.email) {
        return this.authService.signInWithEmailAndPassword(credentials)
      }
    })
  }

  cleanup():Promise<void> {
    return this.signInIfRequired(this.testConfiguration.adminCredentials).then(() => {
      this.authService.awaitKnownAuthSubject$().first().toPromise().then(user => {
        console.log('Signed in for cleanup', user.$key)

      })
    }).catch((reason) => {
      console.error('Could not sign in as admin', reason)
    })
  }
}
