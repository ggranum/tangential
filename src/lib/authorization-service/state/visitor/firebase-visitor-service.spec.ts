/* tslint:disable:no-unused-variable */
import {inject, TestBed} from "@angular/core/testing";
import {
  PermissionService,
  FirebasePermissionService,
  RoleService,
  FirebaseRoleService,
  VisitorService,
  FirebaseVisitorService,
  SignInState,
  FirebaseUserService,
  UserService,
  DefaultAuthorizationDefaultsProvider,
  AuthorizationDefaultsProvider
} from "@tangential/authorization-service";
import {AuthUser, AuthRole, AuthPermission} from "@tangential/media-types";
import {generatePushID} from "@tangential/common";

import {FirebaseProvider, FirebaseConfig} from "@tangential/firebase";
import {TestConfiguration} from "../test-config.spec";
import {firebaseConfig} from "../../../../../config/authorization-service/firebase-config.local";
import {cleanupPermissions} from "../test-setup.spec";

fdescribe('Authorization.state.visitor', () => {
  beforeEach((done) => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [],
      providers: [
        {provide: TestConfiguration, useClass: TestConfiguration},
        {provide: FirebaseConfig, useValue: firebaseConfig},
        {provide: AuthorizationDefaultsProvider, useClass: DefaultAuthorizationDefaultsProvider},
        {provide: FirebaseProvider, useClass: FirebaseProvider},
        {provide: RoleService, useClass: FirebaseRoleService},
        {provide: PermissionService, useClass: FirebasePermissionService},
        {provide: UserService, useClass: FirebaseUserService},
        {provide: VisitorService, useClass: FirebaseVisitorService},
      ]
    })
    inject([TestConfiguration, VisitorService], (testConfig: TestConfiguration, service: VisitorService) => {
      service.signOut().then(done)
    })()
  })


  afterEach((done) => {
    inject([PermissionService, RoleService, UserService, VisitorService], (permissionService: PermissionService,
                                                                           roleService: RoleService,
                                                                           userService: UserService,
                                                                           visitorService: VisitorService) => {
      permissionService.destroy()
      roleService.destroy()
      userService.destroy()
      done()
    })()
  })

  afterAll((done) => {
    inject([PermissionService, VisitorService, TestConfiguration],
      (permissionService: PermissionService, visitorService: VisitorService, testConfiguration: TestConfiguration) => {
        visitorService.signOut().then(() => {
          console.log('after signout')
          visitorService.signInWithEmailAndPassword(testConfiguration.adminCredentials).then(() => {
            console.log('after sign in as admin')
            console.log('Before cleanupPermissions')
            cleanupPermissions(permissionService).then(()=>{
              console.log('done cleaning up permissions')
              done()
            }).catch((reason) => {
              console.error('error', reason)
              done()
            })
          }).catch((reason)=> {
            console.error('Could not sign in as admin', reason)
            done()
          })
        })
      })()
  })



  // this one is tough to test correctly due to how the test runner works - we'd have to refresh the web page
  // to get the 100% fully correct test conditions. Hence, we rely on the 'service.signOut()' call in #beforeEach
  it("initializes to 'signedOut' state and null users.", (done) => {
    inject([VisitorService], (service: VisitorService) => {
      let count = 0
      let state = service.signInState()
      expect(state).toBe(SignInState.signedOut)
      service.signOnObserver().subscribe((authUser) => {
        if (count === 0) {
          expect(authUser).toBeNull("State should start null.")
          done()
        }
        count++
      })

    })()
  })

  it("allows null visitor to sign in anonymously", (done) => {
    inject([VisitorService], (service: VisitorService) => {
      let count = 0
      let state = service.signInState()
      expect(state).toBe(SignInState.signedOut)
      service.signOnObserver().subscribe((authUser) => {
        if (count === 0) {
          expect(authUser).toBeNull("State should start null.")
          service.signInAnonymously().then((visitor: AuthUser) => {
            expect(visitor).not.toBeFalsy('Visitor should not be nullish')
            expect(visitor.isAnonymous).toBe(true, 'Visitor should be anonymous')
            expect(service.signInState()).toBe(SignInState.signedInAnonymous)
            service.deleteAccount().then(done)
          })
        }
        count++
      })
    })()
  })

  it("allows null visitor to register/sign-up", (done) => {
    inject([VisitorService], (service: VisitorService) => {
      let username = 'spec.user.' + generatePushID().replace('-', '')
      let testUserCredentials = {email: username + "@example.com", password: "abc123ABC$"}
      service.createUserWithEmailAndPassword(testUserCredentials).then((visitor: AuthUser) => {
        expect(visitor).not.toBeFalsy('Visitor should not be nullish')
        expect(visitor.isAnonymous).toBe(false, 'Visitor should be anonymous')
        expect(service.signInState()).toBe(SignInState.signedIn)
        service.deleteAccount().then(done)
      })
    })()
  })

  it("copies user info into local database on register/sign-up", (done) => {
    inject([VisitorService, UserService], (service: VisitorService, userService: UserService) => {
      let username = 'spec.user.' + generatePushID().replace('-', '')
      let testUserCredentials = {email: username + "@example.com", password: "abc123ABC$"}
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

  it("loads user data from /auth/users on sign in, if present.", (done) => {
    // register a new user
    // change the user's display name and update it in database
    // sign the user out and sign them back in.

    inject([VisitorService, UserService], (service: VisitorService, userService: UserService) => {
      let username = 'spec.user.' + generatePushID().replace('-', '')
      let testUserCredentials = {email: username + "@example.com", password: "abc123ABC$"}
      service.createUserWithEmailAndPassword(testUserCredentials).then((visitor: AuthUser) => {
        expect(visitor).not.toBeFalsy('Visitor should not be nullish')
        visitor.displayName = 'spec.test'
        userService.update(visitor)
          .then(() => service.signOut())
          .then(() => service.signInWithEmailAndPassword(testUserCredentials))
          .then((updatedVisitor: AuthUser) => {
            expect(updatedVisitor.displayName).toBe(visitor.displayName)
            service.deleteAccount().then(done).catch((reason)=>{
              console.log('Failed to delete account')
              fail(reason)
              done()
            })
          }).catch((reason) =>{
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


  it("provides useful error when user credentials are not valid on sign-in", (done) => {
    inject([VisitorService], (service: VisitorService) => {
      let username = 'spec.user.' + generatePushID().replace('-', '')
      let testUserCredentials = {email: username + "@example.com", password: "abc123ABC$"}
      service.signInWithEmailAndPassword(testUserCredentials).then(() => {
        fail('Should not have been allowed to sign in with invalid credentials')
      }).catch((reason) => {
        expect(reason.code).toBe('auth/user-not-found')
        done()
      })
    })()
  })


  it("Provides a useful error message when user password is incorrect.", (done) => {
    // register a new user
    // sign the user out and sign them back in, but with bad password

    inject([VisitorService], (service: VisitorService) => {
      let username = 'spec.user.' + generatePushID().replace('-', '')
      let testUserCredentials = {email: username + "@example.com", password: "abc123ABC$"}
      service.createUserWithEmailAndPassword(testUserCredentials).then((visitor: AuthUser) => {
        expect(visitor).not.toBeFalsy('Visitor should not be nullish')
        service.signOut()
          .then(() => {
            let badCredentials: any = {}
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
      inject([TestConfiguration, VisitorService], (testConfiguration: TestConfiguration, visitorService: VisitorService) => {
        visitorService.signOut().then(() => {
          visitorService.signInWithEmailAndPassword(testConfiguration.testUserCredentials).then(done)
        })
      })()
    })

    it('should not allow granting a role without GRANT ROLE permission.', (done) => {
      inject([TestConfiguration, VisitorService, RoleService, UserService], (testConfiguration: TestConfiguration,
                                                                             service: VisitorService,
                                                                             roleService: RoleService,
                                                                             userService: UserService) => {
        roleService.valuesOnce().then((roles: AuthRole[]) => {
          let visitor = new AuthUser(testConfiguration.testUserCredentials)
          userService.grantRole(visitor, roles[0]).then(() => {
            fail("granted role but shouldn't have.")
            userService.revokeRole(visitor, roles[0]).then(done).catch(() => {
              console.error("couldn't revoke role, be sure to reset for further testing")
              done()
            })
          }).catch((reason: any) => {
            expect(reason.code).toContain("PERMISSION_DENIED")
            done()
          })
        }).catch((reason) => {
          console.log('Failed:', reason)
          fail("Could not read roles")
          done()
        })
      })()
    })

    it('should not allow granting a permission without GRANT PERMISSION permission.', (done) => {
      inject([TestConfiguration, VisitorService, PermissionService, UserService], (testConfiguration: TestConfiguration,
                                                                                   service: VisitorService,
                                                                                   permissionService: PermissionService,
                                                                                   userService: UserService) => {
        permissionService.valuesOnce().then((permissions: AuthPermission[]) => {
          let visitor = new AuthUser(testConfiguration.testUserCredentials)
          userService.grantPermission(visitor, permissions[0]).then(() => {
            fail("granted permission but shouldn't have.")
            userService.revokePermission(visitor, permissions[0]).then(done).catch(() => {
              console.error("couldn't revoke permission, be sure to reset for further testing")
              done()
            })
          }).catch((reason: any) => {
            expect(reason.code).toContain("PERMISSION_DENIED")
            done()
          })
        }).catch((reason) => {
          console.log('Failed:', reason)
          fail("Could not read roles")
          done()
        })
      })()
    })
  })
})



