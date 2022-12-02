/**
 * Still copying over tests from this file.
 * @todo: ggranum: Finish refactoring tests and delete old firebase-authentication-service specs.
 */


/* tslint:disable:no-unused-variable */
// import {inject, TestBed} from '@angular/core/testing';
// import {
//   AdminService,
//   AuthenticationService,
//   AuthPermission,
//   AuthSettingsService,
//   FirebaseAdminService,
//   FirebaseAuthenticationService,
//   FirebaseAuthSettingsService,
//   FirebaseUserService,
//   UserService
// } from '@tangential/authorization-service';
// import {Logger, MessageBus} from '@tangential/core';
//
// import {FirebaseConfig, FirebaseProvider} from '@tangential/firebase-util';
// import {environment} from '../../../../environments/environment.dev';
// import {TestConfiguration} from '../test-config.spec';
// import {Injectable, ReflectiveInjector} from '@angular/core';
// import {BaseAuthenticationRequiredTestSet} from '../../test/base-auth-service-tests.spec';
//
// jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000


// describe('Authorization.state.auth-service', () => {
//   beforeEach((done) => {
//     TestBed.configureTestingModule({
//       declarations: [],
//       imports: [],
//       providers: [
//         MessageBus,
//         Logger,
//         TestConfiguration,
//         {provide: FirebaseConfig, useValue: environment.firebaseConfig},
//         FirebaseProvider,
//         {provide: UserService, useClass: FirebaseUserService},
//         {provide: AuthSettingsService, useClass: FirebaseAuthSettingsService},
//         {provide: AdminService, useClass: FirebaseAdminService},
//         {provide: AuthenticationService, useClass: FirebaseAuthenticationService},
//         AuthenticationTestSet
//       ]
//     })
//     inject([AuthenticationTestSet], (testSet: AuthenticationTestSet) => {
//       console.log('#beforeEach:inject')
//       testSet.beforeTest().then(() => done())
//     })()
//   })
//
//   afterEach((done) => {
//     console.log('AfterEach ========================')
//     inject([AuthenticationTestSet], (testUtil: AuthenticationTestSet) => {
//       testUtil.afterEach().then(() => {
//         console.log('AfterEach', 'Done')
//         done()
//       })
//     })()
//   })
//
//   afterAll((done) => {
//     console.log('============================== AfterAll ==============================')
//     inject([AuthenticationTestSet], (testSet: AuthenticationTestSet) => {
//       testSet.cleanup().catch(e => {
//         console.log('cleanup failed')
//       }).then(() => done())
//     })()
//   })
//
//
//   it('copies user info into local database on register/sign-up', (done) => {
//     inject([AuthenticationService, UserService], (service: AuthenticationService, userService: UserService) => {
//       const username = 'spec.user.' + generatePushID().replace('-', '')
//       const testUserCredentials = {email: username + '@example.com', password: 'abc123ABC$'}
//       service.createUserWithEmailAndPassword(testUserCredentials).then(() => {
//         service.authSubject$().first().toPromise().then(visitor => {
//           expect(visitor.isAnonymous).toBe(false, 'Visitor should be anonymous')
//           userService.getUserFragment(visitor.$key).then((visitorUserData: AuthUser) => {
//             expect(visitorUserData).toBeTruthy('The new user should have been persisted to the data store')
//             expect(visitorUserData.displayName).toBeTruthy('The new user should have been given a temporary display name.')
//             service.deleteAccount().then(done)
//           })
//         })
//       })
//     })()
//   })
//
//   it('loads user data from /auth/users on sign in, if present.', (done) => {
//     // register a new user
//     // change the user's display name and update it in database
//     // sign the user out and sign them back in.
//
//     inject([AuthenticationService, UserService], (service: AuthenticationService, userService: UserService) => {
//       const username = 'spec.user.' + generatePushID().replace('-', '')
//       const testUserCredentials = {email: username + '@example.com', password: 'abc123ABC$'}
//       service.createUserWithEmailAndPassword(testUserCredentials).then(() => {
//         service.authSubject$().first().toPromise().then(visitor => {
//           expect(visitor).not.toBeFalsy('Visitor should not be nullish')
//           visitor.displayName = 'spec.test'
//           userService.update(visitor)
//             .then(() => service.signOut())
//             .then(() => service.signInWithEmailAndPassword(testUserCredentials))
//             .then(() => {
//               service.deleteAccount().then(done).catch((reason) => {
//                 console.log('Failed to delete account')
//                 fail(reason)
//                 done()
//               })
//             }).catch((reason) => {
//             fail(reason)
//             done()
//           })
//         })
//       }).catch((reason) => {
//         console.log('Test failed', reason, JSON.stringify(testUserCredentials))
//         fail(reason)
//         done()
//       })
//     })()
//   })
//
//
//   it('provides useful error when user credentials are not valid on sign-in', (done) => {
//     inject([AuthenticationService], (service: AuthenticationService) => {
//       const username = 'spec.user.' + generatePushID().replace('-', '')
//       const testUserCredentials = {email: username + '@example.com', password: 'abc123ABC$'}
//       service.signInWithEmailAndPassword(testUserCredentials).then(() => {
//         fail('Should not have been allowed to sign in with invalid credentials')
//       }).catch((reason) => {
//         expect(reason.code).toBe('auth/user-not-found')
//         done()
//       })
//     })()
//   })
//
//
//   it('Provides a useful error message when user password is incorrect.', (done) => {
//     // register a new user
//     // sign the user out and sign them back in, but with bad password
//
//     inject([AuthenticationService], (service: AuthenticationService) => {
//       const username = 'spec.user.' + generatePushID().replace('-', '')
//       const testUserCredentials = {email: username + '@example.com', password: 'abc123ABC$'}
//       service.createUserWithEmailAndPassword(testUserCredentials).then(() => {
//         service.authSubject$().first().toPromise().then(visitor => {
//           expect(visitor).not.toBeFalsy('Visitor should not be nullish')
//           service.signOut()
//             .then(() => {
//               const badCredentials: any = {}
//               badCredentials.password = testUserCredentials.password + 'bad'
//               badCredentials.email = testUserCredentials.email
//               service.signInWithEmailAndPassword(badCredentials).then(() => {
//                 fail('Should not log user in.')
//               }).catch((reason) => {
//                 expect(reason.code).toBe('auth/wrong-password')
//                 service.signInWithEmailAndPassword(testUserCredentials).then(() => {
//                   service.deleteAccount().then(done)
//                 })
//               })
//             })
//         })
//
//       }).catch((reason) => {
//         console.log('Test failed', reason, JSON.stringify(testUserCredentials))
//         fail()
//       })
//     })()
//   })
//
//   describe('.honorsAccessRules', () => {
//     beforeEach((done) => {
//       inject([TestConfiguration, AuthenticationService], (testConfiguration: TestConfiguration, authService: AuthenticationService) => {
//         authService.signOut().then(() => {
//           authService.signInWithEmailAndPassword(testConfiguration.testUserCredentials).then(done)
//         })
//       })()
//     })
//
//     it('should not allow granting a role without GRANT ROLE permission.', (done) => {
//       inject([TestConfiguration, AuthenticationService, RoleService, UserService], (testConfiguration: TestConfiguration,
//                                                                                     service: AuthenticationService,
//                                                                                     roleService: RoleService,
//                                                                                     userService: UserService) => {
//         roleService.valuesOnce().then((roles: AuthRole[]) => {
//           const visitor = new AuthUser()
//           visitor.email = testConfiguration.testUserCredentials.email
//           userService.grantRole(visitor, roles[0]).then(() => {
//             fail('granted role but shouldn\'t have.')
//             userService.revokeRole(visitor.$key, roles[0].$key).then(done).catch(() => {
//               console.error('couldn\'t revoke role, be sure to reset for further testing')
//               done()
//             })
//           }).catch((reason: any) => {
//             expect(reason.code).toContain('PERMISSION_DENIED')
//             done()
//           })
//         }).catch((reason) => {
//           console.log('Failed:', reason)
//           fail('Could not read roles')
//           done()
//         })
//       })()
//     })
//
//     it('should not allow granting a permission without GRANT PERMISSION permission.', (done) => {
//       inject([TestConfiguration, AuthenticationService, PermissionService, UserService], (testConfiguration: TestConfiguration,
//                                                                                           service: AuthenticationService,
//                                                                                           permissionService: PermissionService,
//                                                                                           userService: UserService) => {
//         permissionService.permissions$().first().toPromise().then((permissions: AuthPermission[]) => {
//           const visitor = new AuthUser()
//           visitor.email = testConfiguration.testUserCredentials.email
//           userService.grantPermission(visitor, permissions[0]).then(() => {
//             fail('granted permission but shouldn\'t have.')
//             userService.revokePermission(visitor, permissions[0]).then(done).catch(() => {
//               console.error('couldn\'t revoke permission, be sure to reset for further testing')
//               done()
//             })
//           }).catch((reason: any) => {
//             expect(reason.code).toContain('PERMISSION_DENIED')
//             done()
//           })
//         }).catch((reason) => {
//           console.log('Failed:', reason)
//           fail('Could not read roles')
//           done()
//         })
//       })()
//     })
//   })
// })



