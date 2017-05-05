import {Injectable} from '@angular/core';
import {
  AuthService,
  EmailPasswordCredentials,
  PermissionService,
  RoleService,
  SignInStates,
  UserService
} from '@tangential/authorization-service';
import {Logger, MessageBus} from '@tangential/core';
import {TestConfiguration} from '../state/test-config.spec';
import {cleanupPermissions} from '../state/test-setup.spec';

@Injectable()
export class AuthServiceTestModule {

  constructor(private testConfiguration: TestConfiguration,
              private bus: MessageBus,
              private logger: Logger,
              private permissionService: PermissionService,
              private roleService: RoleService,
              private userService: UserService,
              private authService: AuthService) {
  }

  beforeTest(): Promise<void> {
    return this.signInIfRequired(this.testConfiguration.adminCredentials)
  }

  afterEach(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.permissionService.destroy()
      this.roleService.destroy()
      this.userService.destroy()
      resolve()
    })
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
        cleanupPermissions(this.permissionService).catch((reason) => {
          console.error('Could not clean up permissions.', reason.message)
        })
      })
    }).catch((reason) => {
      console.error('Could not sign in as admin', reason)
    })
  }
}
