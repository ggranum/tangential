/* tslint:disable:no-unused-variable */
import {inject, TestBed} from "@angular/core/testing";
import {AuthPermission} from "@tangential/media-types";
import {cleanupPermissions} from "../test-setup.spec";
import {
  PermissionService,
  FirebasePermissionService,
  VisitorService,
  FirebaseVisitorService,
  RoleService,
  FirebaseRoleService,
  UserService,
  FirebaseUserService,
  DefaultAuthorizationDefaultsProvider,
  AuthorizationDefaultsProvider
} from "@tangential/authorization-service";

import {FirebaseProvider, FirebaseConfig} from "@tangential/firebase-util";
import {TestConfiguration} from "../test-config.spec";
import {firebaseConfig} from "../../config/firebase-config.local";

describe('Auth-services.permission.state', () => {

  beforeEach((done) => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [],
      providers: [
        {provide: TestConfiguration, useClass: TestConfiguration},
        {provide: FirebaseConfig, useValue: firebaseConfig},
        {provide: AuthorizationDefaultsProvider, useClass: DefaultAuthorizationDefaultsProvider},
        {provide: FirebaseProvider, useClass: FirebaseProvider},
        {provide: PermissionService, useClass: FirebasePermissionService},
        {provide: RoleService, useClass: FirebaseRoleService},
        {provide: UserService, useClass: FirebaseUserService},
        {provide: VisitorService, useClass: FirebaseVisitorService},
      ]
    })

    inject([TestConfiguration, VisitorService], (testConfiguration: TestConfiguration, visitorService: VisitorService) => {
      visitorService.signInWithEmailAndPassword(testConfiguration.adminCredentials).then(done)
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
          visitorService.signInWithEmailAndPassword(testConfiguration.adminCredentials).then(() => {
            cleanupPermissions(permissionService).then(()=>{
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

  it('load perms from Permission Service', (done) => {
    inject([PermissionService], (service: PermissionService) => {
      service.values().subscribe((x) => {
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
      let key = "SPEC_RANDOM_" + Math.round((100000 * Math.random()))
      service.create(new AuthPermission({
        $key: key,
        description: "Using firebasePermission Service in spec. ",
        orderIndex: -1
      })).then((x: AuthPermission) => {
        expect(x).toBeTruthy('Should have provided the updated value.')
        expect(x.$key).toBe(key)
        done()
      })
    })()
  })

  it('updates a Permission', (done) => {
    inject([PermissionService], (service: PermissionService) => {
      let key = "SPEC_RANDOM_" + Math.round((100000 * Math.random()))
      let description = "Using firebasePermission Service in spec."
      let updatedDescription = "Using firebasePermission Service in spec - updated."
      let changeCount = 0
      service.values().subscribe((values) => {
        changeCount++
      })

      let primary = new AuthPermission({
        $key: key,
        description: description,
        orderIndex: -1
      })
      let updated = new AuthPermission(primary)
      updated.description = updatedDescription

      service.create(primary).then((created: AuthPermission) => {
        expect(created.$key).toBe(key)
        service.update(updated, primary).then((result) => {
          expect(result.description).toBe(updatedDescription, "Should have updated the description")
          service.value(key)
            .then((updated) => {
              expect(updated.description).toBe(updatedDescription, 'Should have updated the permission.')
              done()
            })
            .catch((e) => {
              console.log('error', e)
              fail('error')
            })
        })
      })
    })()
  })

  it('removes a Permission', (done) => {
    inject([PermissionService], (service: PermissionService) => {
      let key = "SPEC_RANDOM_" + Math.round((100000 * Math.random()))
      let changeCount = 0
      service.values().subscribe((values) => {
        changeCount++
      })

      service.create(new AuthPermission({
        $key: key,
        description: "A spec permission.",
        orderIndex: -1
      })).then((created: AuthPermission) => {
        expect(created.$key).toBe(key)
        service.remove(key).then((removedKey) => {
          expect(removedKey).toBe(key, 'the remove promise should provide the key removed on success.')
          service.value(key)
            .then((removed) => {
              expect(removed).toBeFalsy('Removed values should be null on read.')
              done()
            })
            .catch(() => {
              fail('should return null value rather than fail.')
            })
        }).catch((reason) => {
          fail("shouldn't throw error on remove." + JSON.stringify(reason, null, 2))
        })
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

    it("does not create a Permission if user doesn't have 'ADD PERMISSION' permission.", (done) => {
      inject([PermissionService], (service: PermissionService) => {
        let key = "SPEC_RANDOM_" + Math.round((100000 * Math.random()))
        service.create(new AuthPermission({
          $key: key,
          description: "Using firebasePermission Service in spec. ",
          orderIndex: -1
        })).then((x: AuthPermission) => {
          fail('Should have failed with a permission denied error.')
          done()
        }).catch((e) => {
          expect(e.code).toContain('PERMISSION_DENIED')
          done()
        })
      })()
    })

    it("does not modify a Permission if user doesn't have 'MODIFY PERMISSION' permission.", (done) => {
      inject([PermissionService], (service: PermissionService) => {
        let key = "SPEC_RANDOM_" + Math.round((100000 * Math.random()))
        service.valuesOnce().then((permissions: AuthPermission[]) => {
          let updated = new AuthPermission(permissions[0])
          updated.description = "This should never be seen."
          service.update(updated, permissions[0]).then(() => {
            fail("The updated should have failed with PERMISSION DENIED error.")
          }).catch((e) => {
            expect(e.code).toContain('PERMISSION_DENIED')
            done()
          })
        })
      })()
    })

    it("does not remove a Permission if user doesn't have 'REMOVE PERMISSION' permission.", (done) => {
      inject([PermissionService], (service: PermissionService) => {
        let key = "SPEC_RANDOM_" + Math.round((100000 * Math.random()))
        service.valuesOnce().then((permissions: AuthPermission[]) => {
          service.remove(permissions[0].$key).then(() => {
            fail("The remove should have failed with PERMISSION DENIED error.")
          }).catch((e) => {
            expect(e.code).toContain('PERMISSION_DENIED')
            done()
          })
        })
      })()
    })
  })

});
