/* tslint:disable:no-unused-variable */
import {inject, TestBed} from '@angular/core/testing'
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
} from '@tangential/authorization-service'

import {FirebaseConfig, FirebaseProvider} from '@tangential/firebase-util'
import {environment} from '../../../../environments/environment.dev'
import {TestConfiguration} from '../test-config.spec'
import {cleanupPermissions} from '../test-setup.spec'
jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000

const doFail = (e, done) => {
  fail(e)
  return <any>done()
}

describe('Auth-services.permission.state', () => {

  beforeEach((done) => {
    TestBed.configureTestingModule({
      declarations: [],
      imports:      [],
      providers:    [
        {provide: TestConfiguration, useClass: TestConfiguration},
        {provide: FirebaseConfig, useValue: environment.firebaseConfig},
        {provide: FirebaseProvider, useClass: FirebaseProvider},
        {provide: PermissionService, useClass: FirebasePermissionService},
        {provide: RoleService, useClass: FirebaseRoleService},
        {provide: UserService, useClass: FirebaseUserService},
        {provide: AuthService, useClass: FirebaseAuthService},
      ]
    })

    inject([TestConfiguration, AuthService], (testConfiguration: TestConfiguration, visitorService: AuthService) => {
      visitorService.signInWithEmailAndPassword(testConfiguration.adminCredentials).then(done)
    })()
  })

  afterEach((done) => {
    inject([PermissionService, RoleService, UserService], (permissionService: PermissionService,
                                                           roleService: RoleService,
                                                           userService: UserService) => {
      permissionService.destroy()
      roleService.destroy()
      userService.destroy()
      done()
    })()
  })

  afterAll((done) => {
    inject([PermissionService, AuthService, TestConfiguration],
      (permissionService: PermissionService, visitorService: AuthService, testConfiguration: TestConfiguration) => {
        visitorService.signOut().then(() => {
          visitorService.signInWithEmailAndPassword(testConfiguration.adminCredentials).then(() => {
            cleanupPermissions(permissionService).then(() => {
              done()
            }).catch((reason) => {
              console.error('error', reason)
              done()
            })
          }).catch((reason) => {
            console.error('Could not sign in as admin', reason)
            done()
          })
        })
      })()
  })

  it('load perms from Permission Service', (done) => {
    inject([PermissionService], (service: PermissionService) => {
      service.permissions$().subscribe((x) => {
        let count = 0
        x.forEach((perm: AuthPermission) => {
          count++
        })
        expect(count).toBeGreaterThan(1)
        done()
      })
    })()
  })


  it('creates a Permission', (done) => {
    inject([PermissionService], (service: PermissionService) => {
      const key = 'SPEC_RANDOM_' + Math.round((100000 * Math.random()))
      const testPerm = new AuthPermission({
        $key:        key,
        description: 'Using firebasePermission Service in spec. ',
        orderIndex:  -1
      })
      service.create(testPerm)
        .then(() => service.value(key))
        .then((responseValue) => {
          expect(responseValue).toBeTruthy('Should have read the created value.')
          expect(responseValue.$key).toBe(key)
          done()
        })
        .catch((e) => doFail(e, done))
    })()
  })

  it('updates a Permission', (done) => {
    inject([PermissionService], (service: PermissionService) => {
      const key = 'SPEC_RANDOM_' + Math.round((100000 * Math.random()))
      const description = 'Using firebasePermission Service in spec.'
      const updatedDescription = 'Using firebasePermission Service in spec - updated.'
      let changeCount = 0
      service.permissions$().subscribe((values) => {
        changeCount++
      })

      const primary = new AuthPermission({
        $key:        key,
        description: description,
        orderIndex:  -1
      })
      const updated = new AuthPermission(primary)
      updated.description = updatedDescription

      service.create(primary)
        .then(() => service.update(updated, primary))
        .then(() => service.value(key))
        .then((updated2) => expect(updated2.description).toBe(updatedDescription, 'Should have updated the permission.'))
        .then(() => done())
        .catch((e) => doFail(e, done))
    })()
  })

  it('removes a Permission', (done) => {
    inject([PermissionService], (service: PermissionService) => {
      const key = 'SPEC_RANDOM_' + Math.round((100000 * Math.random()))
      let changeCount = 0
      service.permissions$().subscribe((values) => {
        changeCount++
      })

      const testPermission = new AuthPermission({
        $key:        key,
        description: 'A spec permission.',
        orderIndex:  -1
      })

      service.create(testPermission)
        .then(() => service.remove(key))
        .then(() => expect(key).toBe(key, 'the remove promise should provide the key removed on success.'))
        .then(() => service.value(key))
        .then((removed) => expect(removed).toBeFalsy('Removed values should be null on read.'))
        .then(() => done())
        .catch((e) => doFail(e, done))
    })()
  })

  describe('.honorsAccessRules', () => {
    beforeEach((done) => {
      inject([TestConfiguration, AuthService], (testConfiguration: TestConfiguration, visitorService: AuthService) => {
        visitorService.signOut().then(() => {
          visitorService.signInWithEmailAndPassword(testConfiguration.testUserCredentials).then(done)
        })
      })()
    })

    it('does not create a Permission if user doesn\'t have \'ADD PERMISSION\' permission.', (done) => {
      inject([PermissionService], (service: PermissionService) => {
        const key = 'SPEC_RANDOM_' + Math.round((100000 * Math.random()))

        const testPermission = new AuthPermission({
          $key:        key,
          description: 'Using firebasePermission Service in spec. ',
          orderIndex:  -1
        })

        service.create(testPermission).then(() => {
          fail('Should have failed with a permission denied error.')
          done()
        }).catch((e) => {
          expect(e.code).toContain('PERMISSION_DENIED')
          done()
        })
      })()
    })

    it('does not modify a Permission if user doesn\'t have \'MODIFY PERMISSION\' permission.', (done) => {
      inject([PermissionService], (service: PermissionService) => {
        const key = 'SPEC_RANDOM_' + Math.round((100000 * Math.random()))
        service.valuesOnce().then((permissions: AuthPermission[]) => {
          const updated = new AuthPermission(permissions[0])
          updated.description = 'This should never be seen.'
          service.update(updated, permissions[0]).then(() => {
            fail('The updated should have failed with PERMISSION DENIED error.')
          }).catch((e) => {
            expect(e.code).toContain('PERMISSION_DENIED')
            done()
          })
        })
      })()
    })

    it('does not remove a Permission if user doesn\'t have \'REMOVE PERMISSION\' permission.', (done) => {
      inject([PermissionService], (service: PermissionService) => {
        const key = 'SPEC_RANDOM_' + Math.round((100000 * Math.random()))
        service.valuesOnce().then((permissions: AuthPermission[]) => {
          service.remove(permissions[0].$key).then(() => {
            fail('The remove should have failed with PERMISSION DENIED error.')
          }).catch((e) => {
            expect(e.code).toContain('PERMISSION_DENIED')
            done()
          })
        })
      })()
    })
  })

});
