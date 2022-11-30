import {Injectable} from '@angular/core'
/* tslint:disable:no-unused-variable */
import {
  AdminService, AuthenticationService, AuthPermission, AuthSettingsService
} from '../../index'
import {rejects} from 'assert'
import {first, firstValueFrom} from 'rxjs';
import {Logger, MessageBus} from '@tangential/core'
import {BaseAuthenticationRequiredTestSet, TestEntry} from '../../test/base-auth-service-tests.spec'
import {TestConfiguration} from '../test-config.spec'

jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000


@Injectable()
export class AuthenticationTestSet extends BaseAuthenticationRequiredTestSet {

  constructor(protected override testConfiguration: TestConfiguration,
              protected override bus: MessageBus,
              protected override logger: Logger,
              protected authSettingsService: AuthSettingsService,
              protected adminService: AdminService,
              protected override authService: AuthenticationService) {
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
    return firstValueFrom(this.authSettingsService.authSettings$()).then((x) => {
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
      $key:        key,
      description: 'Using firebasePermission Service in spec. ',
      orderIndex:  -1
    })
    return this.adminService.addPermission(testPerm)
      .then(() => firstValueFrom(this.authSettingsService.authSettings$()).then(settings => {
        expect(settings.permissionsMap()[key]).withContext('Should have read the created value.').toBeTruthy()
      }))
      .catch((e) => this.handleFailure(e))
  }

  allowsTrialAccount(): Promise<void> {
    return this.authService.signOut().then(() => firstValueFrom(this.authService.awaitKnownAuthSubject$()))
      .then((authUser) => expect(authUser.isGuest()).toBeTruthy('User should be signed out.'))
      .then(() => this.authService.signInAnonymously())
      .then(() => firstValueFrom(this.authService.authSubject$()))
      .then(visitor => {
        expect(visitor).withContext('Visitor should not be nullish').not.toBeFalsy()
        expect(visitor.isAnonymous).withContext('Visitor should be anonymous').toBe(true)
        return this.authService.deleteAccount()
      })
  }
}
