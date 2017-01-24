/* tslint:disable:no-unused-variable */
import {inject, TestBed} from "@angular/core/testing";
import {AuthRole, AuthPermission} from "@tangential/media-types";
import {cleanupPermissions, cleanupRoles} from "../test-setup.spec";
import {ObjMapUtil} from "@tangential/common";
import {
  PermissionService,
  FirebasePermissionService,
  RoleService,
  FirebaseRoleService,
  VisitorService,
  FirebaseVisitorService,
  FirebaseUserService,
  UserService, AuthorizationDefaultsProvider,
  DefaultAuthorizationDefaultsProvider
} from "@tangential/authorization-service";
import {FirebaseProvider, FirebaseConfig} from "@tangential/firebase";
import {TestConfiguration} from "../test-config.spec";
import {firebaseConfig} from "../../config/firebase-config.local";


describe('Auth-services.role.state', () => {
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
        {provide: VisitorService, useClass: FirebaseVisitorService},
        {provide: UserService, useClass: FirebaseUserService},
      ]
    })

    inject([TestConfiguration, VisitorService, RoleService],
      (testConfig: TestConfiguration, visitorService: VisitorService, roleService: RoleService) => {
        visitorService.signInWithEmailAndPassword(testConfig.adminCredentials, true).then(() => {
          done()
        })
      })()
  })

  afterEach((done) => {
    inject([PermissionService, RoleService], (permissionService: PermissionService, roleService: RoleService) => {
      permissionService.destroy()
      roleService.destroy()
      done()
    })()
  })


  afterAll((done) => {
    inject([PermissionService, RoleService], (permissionService: PermissionService, roleService: RoleService) => {
      cleanupPermissions(permissionService).then(() => cleanupRoles(roleService)).then(done)
    })()
  })

  it('load roles from Role Service', (done) => {
    inject([RoleService], (service: RoleService) => {
      service.values().subscribe((roles) => {
        let count = 0
        roles.forEach((role: AuthRole) => {
          count++
        })
        expect(count).toBeGreaterThan(1)
        done()
      })
    })()
  })

  it('creates a Role', (done) => {
    inject([RoleService], (service: RoleService) => {

      let key = "SPEC_RANDOM_" + Math.round((100000 * Math.random()))
      service.create(new AuthRole({
        $key: key,
        description: "Using firebaseRole Service in spec. ",
        orderIndex: -1
      })).then((role: AuthRole) => {
        expect(role).toBeTruthy('Should have provided the updated value.')
        expect(role.$key).toBe(key)
        done()
      })
    })()
  })


  it('updates a Role', (done) => {
    inject([RoleService], (service: RoleService) => {
      let key = "SPEC_RANDOM_" + Math.round((100000 * Math.random()))
      let description = "Using firebaseRole Service in spec."
      let updatedDescription = "Using firebaseRole Service in spec - updated."
      let changeCount = 0


      let primary = new AuthRole({
        $key: key,
        description: description,
        orderIndex: -1
      })
      let updated = new AuthRole(primary)
      updated.description = updatedDescription

      let start = () => {
        service.create(primary).then((createdRole: AuthRole) => {
          expect(createdRole.$key).toBe(key)
          service.update(updated, primary).then((result) => {
            expect(result.description).toBe(updatedDescription, "Should have updated the description")
            service.value(key)
              .then((updatedRole) => {
                expect(updatedRole.description).toBe(updatedDescription, 'Should have updated hte role.')
                expect(changeCount).toBe(3, 'Should trigger changes.')
                done()
              })
              .catch((e) => {
                console.log('error', e)
                fail('error')
              })
          })
        })
      }

      service.values().subscribe((values) => {
        changeCount++
        if (changeCount === 1) {
          start()
        }
      })
    })()
  })

  it('removes a Role', (done) => {
    inject([RoleService], (service: RoleService) => {
      let key = "SPEC_RANDOM_" + Math.round((100000 * Math.random()))
      let changeCount = 0
      let start = () => {
        service.create(new AuthRole({
          $key: key,
          description: "Using firebaseRole Service in spec. ",
          orderIndex: -1
        })).then((created: AuthRole) => {
          expect(created.$key).toBe(key)
          service.remove(key).then((removedKey) => {
            service.value(key)
              .then((removed) => {
                expect(removed).toBeFalsy('Removed values should be null on read.')
                expect(removedKey).toBe(key, 'the remove promise should provide the key removed on success.')
                expect(changeCount).toBe(3, 'Should trigger changes.')
                done()
              })
              .catch(() => {
                fail('should return null value rather than fail.')
              })
          })
        })
      }
      service.values().subscribe((values) => {
        changeCount++
        if (changeCount === 1) {
          start()
        }
      })
    })()
  })

  it('grants a permission on a role', (done) => {
    inject([RoleService, PermissionService], (roleService: RoleService, permissionService: PermissionService) => {
      let roleKey = "SPEC_RANDOM_ROLE" + Math.round((100000 * Math.random()))
      let permKey = "SPEC_RANDOM_PERM" + Math.round((100000 * Math.random()))

      let role = new AuthRole({
        $key: roleKey,
        description: "A spec role."
      })
      let permission = new AuthPermission({
        $key: permKey,
        description: "A spec permission."
      })

      let start = () => {
        roleService.grantPermission(role, permission).then((value) => {
          expect(value.role).toBeTruthy()
          expect(value.permission).toBeTruthy()
          roleService.revokePermission(role, permission).then(() => done())
        })
      }

      permissionService.create(permission).then(() => {
        roleService.create(role).then(start)
      })
    })()
  })

  it('revokes a permission on a role', (done) => {
    inject([RoleService, PermissionService], (roleService: RoleService, permissionService: PermissionService) => {
      let roleKey = "SPEC_RANDOM_ROLE" + Math.round((100000 * Math.random()))
      let permKey = "SPEC_RANDOM_PERM" + Math.round((100000 * Math.random()))

      let role = new AuthRole({
        $key: roleKey,
        description: "A spec role."
      })
      let permission = new AuthPermission({
        $key: permKey,
        description: "A spec permission."
      })

      let start = () => {
        roleService.revokePermission(role, permission).then((value) => {
          expect(value.role).toBeTruthy()
          expect(value.permission).toBeTruthy()
          done()
        })
      }

      permissionService.create(permission).then(() => {
        roleService.create(role).then(() => {
          roleService.grantPermission(role, permission).then(() => {
            start()
          })
        })
      })
    })()
  })

  it('removes a permission from a role when the permission is deleted', (done) => {
    inject([RoleService, PermissionService], (roleService: RoleService, permissionService: PermissionService) => {

      let roleKey = "SPEC_RANDOM_ROLE_" + Math.round((100000 * Math.random()))
      let permKey = "SPEC_RANDOM_PERM_" + Math.round((100000 * Math.random()))
      let permKey2 = permKey + "-2"
      let permKey3 = permKey + "-3"
      let role = new AuthRole({
        $key: roleKey,
        description: "A spec role."
      })
      let permission = new AuthPermission({
        $key: permKey,
        description: "A spec permission - " + permKey
      })
      let permission2 = new AuthPermission({
        $key: permKey2,
        description: "A spec permission - " + permKey2
      })
      let permission3 = new AuthPermission({
        $key: permKey3,
        description: "A spec permission - " + permKey3
      })

      let count = 0
      let start = () => {
        roleService.getPermissionsForRole$(role).subscribe((permissions: AuthPermission[]) => {
          let map = ObjMapUtil.fromKeyedEntityArray(permissions)
          if (count === 0) {
            expect(permissions.length).toBe(3)
            expect(map[permKey]).toBeTruthy('Perm1 should be assigned')
            expect(map[permKey2].description).toBe(permission2.description)
            permissionService.remove(permKey).then((result) => {
              expect(result).toBe(permKey)
            })
          }
          if (count === 1) {
            expect(permissions.length).toBe(2)
            expect(map[permKey]).toBeFalsy('Perm1 should NOT be assigned')
            expect(map[permKey2].description).toBe(permission2.description)
            permissionService.remove(permKey2).then(() => permissionService.remove(permKey3)).then(() => done())
          }
          count++
        })
      }

      permissionService.create(permission)
        .then(() => permissionService.create(permission2))
        .then(() => permissionService.create(permission3))
        .then(() => roleService.create(role))
        .then(() => roleService.grantPermission(role, permission))
        .then(() => roleService.grantPermission(role, permission2))
        .then(() => roleService.grantPermission(role, permission3))
        .then(start)
    })()
  })
});
