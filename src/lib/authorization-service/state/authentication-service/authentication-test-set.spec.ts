/* tslint:disable:no-unused-variable */
import {AdminService, AuthenticationService, AuthPermission, AuthSettingsService} from '@tangential/authorization-service';
import {Logger, MessageBus} from '@tangential/core';
import {TestConfiguration} from '../test-config.spec';
import {Injectable} from '@angular/core';
import {BaseAuthenticationRequiredTestSet, TestEntry} from '../../test/base-auth-service-tests.spec';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000


@Injectable()
export class AuthenticationTestSet extends BaseAuthenticationRequiredTestSet {

  constructor(protected testConfiguration: TestConfiguration,
              protected bus: MessageBus,
              protected logger: Logger,
              protected authSettingsService: AuthSettingsService,
              protected adminService: AdminService,
              protected authService: AuthenticationService) {
    super('Authorization.state.authentication', testConfiguration, bus, logger, authService)

  }

  declareTests(): TestEntry[] {
    return [
      ['Loads all permissions', (done) => this.loadsAllPermissions().then(done)],
      ['Creates a permission', (done) => this.createsPermission().then(done)],
      ['allows trial account login (AKA anonymous login)', (done) => this.allowsTrialAccount().then(done)],
    ]
  }

  loadsAllPermissions(): Promise<void> {
    console.log('AuthenticationTestSet', 'loadsAllPermissions')
    return this.authSettingsService.authSettings$().first().toPromise().then((x) => {
      let count = 0
      let all = []
      x.permissions.forEach((perm: AuthPermission) => {
        count++
        all.push(perm.$key)
      })
      expect(count).toBeGreaterThan(1)
      console.log('PermissionsTestModule', `LoadsAllPermissions - found ${count} permissions: ${all.join('\n\t')}`)
    }).catch(e => {
      this.handleFailure(e)
    })
  }

  createsPermission(): Promise<void> {
    const key = 'SPEC_RANDOM_' + Math.round((100000 * Math.random()))
    const testPerm = AuthPermission.from({
      $key: key,
      description: 'Using firebasePermission Service in spec. ',
      orderIndex: -1
    })
    return this.adminService.addPermission(testPerm)
      .then(() => this.authSettingsService.authSettings$().first().toPromise().then(settings => {
        expect(settings.permissionsMap()[key]).toBeTruthy('Should have read the created value.')
      }))
      .catch((e) => this.handleFailure(e))
  }

  allowsTrialAccount(): Promise<void> {
    return this.authService.signOut().then(() => this.authService.awaitKnownAuthSubject$().first().toPromise())
      .then((authUser) => expect(authUser.isGuest()).toBeTruthy('User should be signed out.'))
      .then(() => this.authService.signInAnonymously())
      .then(() => this.authService.authSubject$().first().toPromise())
      .then(visitor => {
        expect(visitor).not.toBeFalsy('Visitor should not be nullish')
        expect(visitor.isAnonymous).toBe(true, 'Visitor should be anonymous')
        return this.authService.deleteAccount()
      })
  }
}
