/* tslint:disable:no-unused-variable */
import {inject, TestBed} from '@angular/core/testing';
import {
  AuthPermission,
  AuthService,
  FirebaseAuthService,
  FirebasePermissionService,
  FirebaseRoleService,
  FirebaseUserService,
  PermissionService,
  RoleService,
  UserService
} from '@tangential/authorization-service';

import {FirebaseConfig, FirebaseProvider} from '@tangential/firebase-util';
import {environment} from '../../../../environments/environment.dev';
import {TestConfiguration} from '../test-config.spec';
import {Logger, MessageBus} from '@tangential/core';
import {AuthServiceTestModule} from '../../test/firebase-test-util';
import {Injectable} from '@angular/core';
import {TanjTestModule} from '../../../core/test/tanj-test-module';
jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000

const doFail = (e, done) => {
  fail(e)
  return <any>done()
}

export interface TanjTest {
  description: string
  test: string
}

@Injectable()
export class PermissionsTestModule extends TanjTestModule {
  constructor(private service: PermissionService) {
    super()
  }

  static tests = {
    loadsAllPermissions: 'Loads all permissions',
    createsPermission: 'Creates a permission',
    updatesPermission: 'Updates a permission',
    removesPermission: 'Removes a permission',
  }

  loadsAllPermissions(done) {
    let sub = this.service.permissions$().first().subscribe((x) => {
      let count = 0
      let all = []
      x.forEach((perm: AuthPermission) => {
        count++
        all.push(perm.$key)
      })
      expect(count).toBeGreaterThan(1)
      console.log('PermissionsTestModule', `LoadsAllPermissions - found ${count} permissions: ${all.join('\n\t')}`)
      sub.unsubscribe()
      done()
    })
  }

  createsPermission(done) {
    const key = 'SPEC_RANDOM_' + Math.round((100000 * Math.random()))
    const testPerm = AuthPermission.from({
      $key: key,
      description: 'Using firebasePermission Service in spec. ',
      orderIndex: -1
    })
    this.service.create(testPerm)
      .then(() => this.service.value(key))
      .then((responseValue) => {
        expect(responseValue).toBeTruthy('Should have read the created value.')
        expect(responseValue.$key).toBe(key)
        done()
      })
      .catch((e) => doFail(e, done))
  }

  updatesPermission(done) {
    const key = 'SPEC_RANDOM_' + Math.round((100000 * Math.random()))
    const description = 'Using firebasePermission Service in spec.'
    const updatedDescription = 'Using firebasePermission Service in spec - updated.'
    let changeCount = 0
    this.service.permissions$().subscribe((values) => {
      changeCount++
    })

    const primary = AuthPermission.from({
      $key: key,
      description: description,
      orderIndex: -1
    })
    const updated = AuthPermission.from(primary)
    updated.description = updatedDescription

    this.service.create(primary)
      .then(() => this.service.update(updated, primary))
      .then(() => this.service.value(key))
      .then((updated2) => expect(updated2.description).toBe(updatedDescription, 'Should have updated the permission.'))
      .then(() => done())
      .catch((e) => doFail(e, done))
  }

  removesPermission(done){
    const key = 'SPEC_RANDOM_' + Math.round((100000 * Math.random()))
    let changeCount = 0
    this.service.permissions$().subscribe((values) => {
      changeCount++
    })

    const testPermission = AuthPermission.from({
      $key: key,
      description: 'A spec permission.',
      orderIndex: -1
    })

    this.service.create(testPermission)
      .then(() => this.service.remove(key))
      .then(() => expect(key).toBe(key, 'the remove promise should provide the key removed on success.'))
      .then(() => this.service.value(key))
      .then((removed) => expect(removed).toBeFalsy('Removed values should be null on read.'))
      .then(() => done())
      .catch((e) => doFail(e, done))
  }


}


fdescribe('Auth-services.permission.state', () => {

  beforeEach((done) => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [],
      providers: [
        MessageBus,
        Logger,
        {provide: TestConfiguration, useClass: TestConfiguration},
        {provide: FirebaseConfig, useValue: environment.firebaseConfig},
        {provide: FirebaseProvider, useClass: FirebaseProvider},
        {provide: PermissionService, useClass: FirebasePermissionService},
        {provide: RoleService, useClass: FirebaseRoleService},
        {provide: UserService, useClass: FirebaseUserService},
        {provide: AuthService, useClass: FirebaseAuthService},
        AuthServiceTestModule,
        PermissionsTestModule,
      ]
    })
    inject([AuthServiceTestModule], (testUtil: AuthServiceTestModule) => {
      console.log('#beforeEach:inject')
      testUtil.beforeTest().then(() => done())
    })()
  })

  afterEach((done) => {
    console.log('AfterEach ========================')
    inject([AuthServiceTestModule], (testUtil: AuthServiceTestModule) => {
      testUtil.afterEach().then(() => {
        console.log('AfterEach', 'Done')
        done()
      })
    })()
  })

  afterAll((done) => {
    console.log('============================== AfterAll ==============================')
    inject([AuthServiceTestModule], (testUtil: AuthServiceTestModule) => {
      testUtil.cleanup().catch(e => {
        console.log('cleanup failed')
      }).then(() => done())
    })()
  })

  Object.keys(PermissionsTestModule.tests).forEach(testKey => {
    it.apply(this, PermissionsTestModule.asTest(PermissionsTestModule, testKey))
  })


  // xdescribe('.honorsAccessRules', () => {
  //   beforeEach((done) => {
  //     inject([TestConfiguration, AuthService], (testConfiguration: TestConfiguration, authService: AuthService) => {
  //       authService.signOut().then(() => {
  //         authService.signInWithEmailAndPassword(testConfiguration.testUserCredentials).then(done)
  //       })
  //     })()
  //   })
  //
  //   it('does not create a Permission if user doesn\'t have \'ADD PERMISSION\' permission.', (done) => {
  //     inject([PermissionService], (service: PermissionService) => {
  //       const key = 'SPEC_RANDOM_' + Math.round((100000 * Math.random()))
  //
  //       const testPermission = AuthPermission.from({
  //         $key: key,
  //         description: 'Using firebasePermission Service in spec. ',
  //         orderIndex: -1
  //       })
  //
  //       service.create(testPermission).then(() => {
  //         fail('Should have failed with a permission denied error.')
  //         done()
  //       }).catch((e) => {
  //         expect(e.code).toContain('PERMISSION_DENIED')
  //         done()
  //       })
  //     })()
  //   })
  //
  //   it('does not modify a Permission if user doesn\'t have \'MODIFY PERMISSION\' permission.', (done) => {
  //     inject([PermissionService], (service: PermissionService) => {
  //       const key = 'SPEC_RANDOM_' + Math.round((100000 * Math.random()))
  //       service.permissions$().first().toPromise().then((permissions: AuthPermission[]) => {
  //         const updated = new AuthPermission(permissions[0].$key)
  //         updated.description = 'This should never be seen.'
  //         service.update(updated, permissions[0]).then(() => {
  //           fail('The updated should have failed with PERMISSION DENIED error.')
  //         }).catch((e) => {
  //           expect(e.code).toContain('PERMISSION_DENIED')
  //           done()
  //         })
  //       })
  //     })()
  //   })
  //
  //   it('does not remove a Permission if user doesn\'t have \'REMOVE PERMISSION\' permission.', (done) => {
  //     inject([PermissionService], (service: PermissionService) => {
  //       const key = 'SPEC_RANDOM_' + Math.round((100000 * Math.random()))
  //       service.permissions$().first().toPromise().then((permissions: AuthPermission[]) => {
  //         service.remove(permissions[0].$key).then(() => {
  //           fail('The remove should have failed with PERMISSION DENIED error.')
  //         }).catch((e) => {
  //           expect(e.code).toContain('PERMISSION_DENIED')
  //           done()
  //         })
  //       })
  //     })()
  //   })
  // })

});

