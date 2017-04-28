/* tslint:disable:no-unused-variable */
import {inject, TestBed} from '@angular/core/testing'
import {
  AuthorizationDefaultsProvider,
  AuthPermission,
  AuthRole,
  AuthService,
  AuthUser,
  DefaultAuthorizationDefaultsProvider,
  FirebaseAuthService,
  FirebasePermissionService,
  FirebaseRoleService,
  FirebaseUserService,
  PermissionService,
  RoleService,
  UserService
} from '@tangential/authorization-service'
import {generatePushID} from '@tangential/core'

import {FirebaseConfig, FirebaseProvider} from '@tangential/firebase-util'
import {environment} from '../../../../environments/environment.dev'
import {TestConfiguration} from '../test-config.spec'
import {cleanupPermissions} from '../test-setup.spec'

jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000

describe('Authorization.state.auth-service', () => {
  beforeEach((done) => {
    TestBed.configureTestingModule({
      declarations: [],
      imports:      [],
      providers:    [
        {provide: TestConfiguration, useClass: TestConfiguration},
        {provide: FirebaseConfig, useValue: environment.firebaseConfig},
        {provide: AuthorizationDefaultsProvider, useClass: DefaultAuthorizationDefaultsProvider},
        {provide: FirebaseProvider, useClass: FirebaseProvider},
        {provide: RoleService, useClass: FirebaseRoleService},
        {provide: PermissionService, useClass: FirebasePermissionService},
        {provide: UserService, useClass: FirebaseUserService},
        {provide: AuthService, useClass: FirebaseAuthService},
      ]
    })
    inject([TestConfiguration, AuthService], (testConfig: TestConfiguration, service: AuthService) => {
      service.signOut().then(done)
    })()
  })


  afterEach((done) => {
    inject([PermissionService, RoleService, UserService, AuthService], (permissionService: PermissionService,
                                                                        roleService: RoleService,
                                                                        userService: UserService,
                                                                        visitorService: AuthService) => {
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
          console.log('after signout')
          visitorService.signInWithEmailAndPassword(testConfiguration.adminCredentials).then(() => {
            console.log('after sign in as admin')
            console.log('Before cleanupPermissions')
            cleanupPermissions(permissionService).then(() => {
              console.log('done cleaning up permissions')
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


  // this one is tough to test correctly due to how the test runner works - we'd have to refresh the web page
  // to get the 100% fully correct test conditions. Hence, we rely on the 'service.signOut()' call in #beforeEach
  it('initializes to \'signedOut\' state and null users.', (done) => {
    inject([AuthService], (service: AuthService) => {
      let count = 0
      service.authUser$().subscribe((authUser) => {
        if (count === 0) {
          expect(authUser).toBeNull('State should start null.')
          done()
        }
        count++
      })

    })()
  })

  it('allows null visitor to sign in anonymously', (done) => {
    inject([AuthService], (service: AuthService) => {
      let count = 0
      service.authUser$().subscribe((authUser) => {
        if (count === 0) {
          expect(authUser).toBeNull('State should start null.')
          service.signInAnonymously().then((visitor: AuthUser) => {
            expect(visitor).not.toBeFalsy('Visitor should not be nullish')
            expect(visitor.isAnonymous).toBe(true, 'Visitor should be anonymous')
            service.deleteAccount().then(done)
          })
        }
        count++
      })
    })()
  })

  it('allows null visitor to register/sign-up', (done) => {
    inject([AuthService], (service: AuthService) => {
      const username = 'spec.user.' + generatePushID().replace('-', '')
      const testUserCredentials = {email: username + '@example.com', password: 'abc123ABC$'}
      service.createUserWithEmailAndPassword(testUserCredentials).then((visitor: AuthUser) => {
        expect(visitor).not.toBeFalsy('Visitor should not be nullish')
        expect(visitor.isAnonymous).toBe(false, 'Visitor should be anonymous')
        service.deleteAccount().then(done)
      })
    })()
  })

  it('copies user info into local database on register/sign-up', (done) => {
    inject([AuthService, UserService], (service: AuthService, userService: UserService) => {
      const username = 'spec.user.' + generatePushID().replace('-', '')
      const testUserCredentials = {email: username + '@example.com', password: 'abc123ABC$'}
      service.createUserWithEmailAndPassword(testUserCredentials).then((visitor: AuthUser) => {
        expect(visitor.isAnonymous).toBe(false, 'Visitor should be anonymous')
        userService.value(visitor.$key).then((visitorUserData: AuthUser) => {
          expect(visitorUserData).toBeTruthy('The new user should have been persisted to the data store')
          expect(visitorUserData.displayName).toBeTruthy('The new user should have been given a temporary display name.')
          service.deleteAccount().then(done)
        })
      })
    })()
  })

  it('loads user data from /auth/users on sign in, if present.', (done) => {
    // register a new user
    // change the user's display name and update it in database
    // sign the user out and sign them back in.

    inject([AuthService, UserService], (service: AuthService, userService: UserService) => {
      const username = 'spec.user.' + generatePushID().replace('-', '')
      const testUserCredentials = {email: username + '@example.com', password: 'abc123ABC$'}
      service.createUserWithEmailAndPassword(testUserCredentials).then((visitor: AuthUser) => {
        expect(visitor).not.toBeFalsy('Visitor should not be nullish')
        visitor.displayName = 'spec.test'
        userService.update(visitor)
          .then(() => service.signOut())
          .then(() => service.signInWithEmailAndPassword(testUserCredentials))
          .then((updatedVisitor: AuthUser) => {
            expect(updatedVisitor.displayName).toBe(visitor.displayName)
            service.deleteAccount().then(done).catch((reason) => {
              console.log('Failed to delete account')
              fail(reason)
              done()
            })
          }).catch((reason) => {
          fail(reason)
          done()
        })
      }).catch((reason) => {
        console.log('Test failed', reason, JSON.stringify(testUserCredentials))
        fail(reason)
        done()
      })
    })()
  })


  it('provides useful error when user credentials are not valid on sign-in', (done) => {
    inject([AuthService], (service: AuthService) => {
      const username = 'spec.user.' + generatePushID().replace('-', '')
      const testUserCredentials = {email: username + '@example.com', password: 'abc123ABC$'}
      service.signInWithEmailAndPassword(testUserCredentials).then(() => {
        fail('Should not have been allowed to sign in with invalid credentials')
      }).catch((reason) => {
        expect(reason.code).toBe('auth/user-not-found')
        done()
      })
    })()
  })


  it('Provides a useful error message when user password is incorrect.', (done) => {
    // register a new user
    // sign the user out and sign them back in, but with bad password

    inject([AuthService], (service: AuthService) => {
      const username = 'spec.user.' + generatePushID().replace('-', '')
      const testUserCredentials = {email: username + '@example.com', password: 'abc123ABC$'}
      service.createUserWithEmailAndPassword(testUserCredentials).then((visitor: AuthUser) => {
        expect(visitor).not.toBeFalsy('Visitor should not be nullish')
        service.signOut()
          .then(() => {
            const badCredentials: any = {}
            badCredentials.password = testUserCredentials.password + 'bad'
            badCredentials.email = testUserCredentials.email
            service.signInWithEmailAndPassword(badCredentials).then(() => {
              fail('Should not log user in.')
            }).catch((reason) => {
              expect(reason.code).toBe('auth/wrong-password')
              service.signInWithEmailAndPassword(testUserCredentials).then(() => {
                service.deleteAccount().then(done)
              })
            })
          })

      }).catch((reason) => {
        console.log('Test failed', reason, JSON.stringify(testUserCredentials))
        fail()
      })
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

    it('should not allow granting a role without GRANT ROLE permission.', (done) => {
      inject([TestConfiguration, AuthService, RoleService, UserService], (testConfiguration: TestConfiguration,
                                                                          service: AuthService,
                                                                          roleService: RoleService,
                                                                          userService: UserService) => {
        roleService.valuesOnce().then((roles: AuthRole[]) => {
          const visitor = new AuthUser(testConfiguration.testUserCredentials)
          userService.grantRole(visitor, roles[0]).then(() => {
            fail('granted role but shouldn\'t have.')
            userService.revokeRole(visitor, roles[0]).then(done).catch(() => {
              console.error('couldn\'t revoke role, be sure to reset for further testing')
              done()
            })
          }).catch((reason: any) => {
            expect(reason.code).toContain('PERMISSION_DENIED')
            done()
          })
        }).catch((reason) => {
          console.log('Failed:', reason)
          fail('Could not read roles')
          done()
        })
      })()
    })

    it('should not allow granting a permission without GRANT PERMISSION permission.', (done) => {
      inject([TestConfiguration, AuthService, PermissionService, UserService], (testConfiguration: TestConfiguration,
                                                                                service: AuthService,
                                                                                permissionService: PermissionService,
                                                                                userService: UserService) => {
        permissionService.valuesOnce().then((permissions: AuthPermission[]) => {
          const visitor = new AuthUser(testConfiguration.testUserCredentials)
          userService.grantPermission(visitor, permissions[0]).then(() => {
            fail('granted permission but shouldn\'t have.')
            userService.revokePermission(visitor, permissions[0]).then(done).catch(() => {
              console.error('couldn\'t revoke permission, be sure to reset for further testing')
              done()
            })
          }).catch((reason: any) => {
            expect(reason.code).toContain('PERMISSION_DENIED')
            done()
          })
        }).catch((reason) => {
          console.log('Failed:', reason)
          fail('Could not read roles')
          done()
        })
      })()
    })
  })
})



