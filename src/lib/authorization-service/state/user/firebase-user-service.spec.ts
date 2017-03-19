/* tslint:disable:no-unused-variable */
import {inject, TestBed} from "@angular/core/testing";
import {AuthUser, AuthPermission, AuthRole} from "@tangential/media-types";
import {cleanupPermissions, cleanupUsers, cleanupRoles} from "../test-setup.spec";
import {ObjMapUtil} from "@tangential/common";
import {
  UserService,
  FirebaseUserService,
  PermissionService,
  FirebasePermissionService,
  RoleService,
  FirebaseRoleService,
  VisitorService,
  FirebaseVisitorService,
  DefaultAuthorizationDefaultsProvider,
  AuthorizationDefaultsProvider
} from "@tangential/authorization-service";


import {FirebaseProvider, FirebaseConfig} from "@tangential/firebase-util";
import {TestConfiguration} from "../test-config.spec";
import {firebaseConfig} from "../../config/firebase-config.local";

jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000

describe('Auth-services.user.state', () => {
  beforeEach((done) => {

    TestBed.configureTestingModule({
      declarations: [],
      imports: [],
      providers: [
        {provide: TestConfiguration, useClass: TestConfiguration},
        {provide: FirebaseConfig, useValue: firebaseConfig},
        {provide: AuthorizationDefaultsProvider, useClass: DefaultAuthorizationDefaultsProvider},
        {provide: FirebaseProvider, useClass: FirebaseProvider},
        {provide: UserService, useClass: FirebaseUserService},
        {provide: PermissionService, useClass: FirebasePermissionService},
        {provide: RoleService, useClass: FirebaseRoleService},
        {provide: VisitorService, useClass: FirebaseVisitorService},
      ]
    })

    inject([TestConfiguration, VisitorService, UserService], (testConfig: TestConfiguration, visitorService: VisitorService) => {
      visitorService.signInWithEmailAndPassword(testConfig.adminCredentials).then(done)
    })()
  })

  afterEach((done) => {
    inject([PermissionService, RoleService, UserService], (permissionService: PermissionService, roleService: RoleService, userService: UserService) => {
      permissionService.destroy()
      roleService.destroy()
      userService.destroy()
      done()
    })()
  })


  afterAll((done) => {
    inject([PermissionService, RoleService, UserService], (permissionService: PermissionService, roleService: RoleService, userService: UserService) => {
      cleanupPermissions(permissionService).then(() => cleanupRoles(roleService)).then(() => cleanupUsers(userService)).then(done)
    })()
  })

  it('load users from User Service', (done) => {
    inject([UserService], (service: UserService) => {
      service.values().subscribe((users) => {
        let count = 0
        users.forEach(() => {
          count++
        })
        expect(count).toBeGreaterThan(0)
        done()
      }, (e) => {
        console.log('Error handling load users', e)
      })
    })()
  })

  it('creates a User', (done) => {
    inject([UserService], (service: UserService) => {

      let key = "SPEC_RANDOM_USER" + Math.round((100000 * Math.random()))
      service.create(new AuthUser({
        $key: key,
        displayName: key
      })).then((user: AuthUser) => {
        expect(user).toBeTruthy('Should have provided the updated value.')
        expect(user.$key).toBe(key)
        done()
      })
    })()
  })


  it('updates a User', (done) => {
    inject([UserService], (service: UserService) => {
      let key = "SPEC_RANDOM_USER" + Math.round((100000 * Math.random()))
      let updatedDisplayName = "updated"
      let changeCount = 0

      let primary = new AuthUser({
        $key: key,
        displayName: key,
      })
      let updated = new AuthUser(primary)
      updated.displayName = updatedDisplayName

      service.create(primary)
        .then((createdUser: AuthUser) => expect(createdUser.$key).toBe(key)).catch((e) => fail() )
        .then(() => service.update(updated, primary)).catch((e) => fail() )
        .then(() => service.value(key)).catch((e) => <any>fail() )
        .then((updatedUser) => {
          expect(updatedUser.displayName).toBe(updatedDisplayName, 'Should have updated the User.')
        }).catch((e) => fail())
        .then(() => done())
        .catch((reason) => {
          fail(reason)
          done()
        })
    })()

  })

  it('removes a User', (done) => {
    inject([UserService], (service: UserService) => {
      let key = "SPEC_RANDOM_USER" + Math.round((100000 * Math.random()))
      let changeCount = 0
      let testUser = new AuthUser({
        $key: key,
        displayName: key,
      })
      service.create(testUser).then((created: AuthUser) => expect(created.$key).toBe(key))
        .then(() => service.remove(key))
        .then((removedKey) => service.value(key))
        .then((removed) => {
          expect(removed).toBeFalsy('Removed values should be null on read.')
          done()
        })
        .catch(() => {
          fail('should return null value rather than fail.')
        })
    })()
  })

  it('grants a permission on a user', (done) => {
    inject([UserService, PermissionService], (userService: UserService, permissionService: PermissionService) => {
      let userKey = "SPEC_RANDOM_USER" + Math.round((100000 * Math.random()))
      let permKey = "SPEC_RANDOM_PERM" + Math.round((100000 * Math.random()))

      let user = new AuthUser({
        $key: userKey,
        displayName: userKey
      })
      let permission = new AuthPermission({
        $key: permKey,
        description: "A spec permission."
      })

      permissionService.create(permission)
        .then(() => userService.create(user))
        .then(() => userService.grantPermission(user, permission))
        .then(() => userService.getEffectivePermissionsForUser(user))
        .then((perms: AuthPermission[]) => {
          expect(perms.filter(perm => perm.$key === permission.$key)[0]).toBeTruthy()
        })
        .then(() => userService.revokePermission(user, permission))
        .then(() => done())
        .catch((reason) => {
          fail(reason);
          done()
        })


    })()
  })

  it('revokes a permission on a user', (done) => {
    inject([UserService, PermissionService], (userService: UserService, permissionService: PermissionService) => {
      let userKey = "SPEC_RANDOM_USER" + Math.round((100000 * Math.random()))
      let permKey = "SPEC_RANDOM_PERM" + Math.round((100000 * Math.random()))

      let user = new AuthUser({
        $key: userKey,
        displayName: userKey
      })
      let permission = new AuthPermission({
        $key: permKey,
        description: "A spec permission."
      })

      permissionService.create(permission)
        .then(() => userService.create(user))
        .then(() => userService.grantPermission(user, permission))
        .then(() => userService.getEffectivePermissionsForUser(user))
        .then((perms: AuthPermission[]) => {
          expect(perms.some(perm => perm.$key === permission.$key)).toBeTruthy()
        })
        .then(() => userService.revokePermission(user, permission))
        .then(() => userService.getEffectivePermissionsForUser(user))
        .then((perms: AuthPermission[]) => {
          expect(perms.some(perm => perm.$key === permission.$key)).toBeFalsy()
        })
        .then(() => done())
        .catch((reason) => {
          fail(reason);
          done()
        })


    })()

  })

  xit('removes a permission from a user when the permission is deleted', (done) => {
    inject([UserService, PermissionService], (userService: UserService, permissionService: PermissionService) => {

      let userKey = "SPEC_RANDOM_USER_" + Math.round((100000 * Math.random()))
      let permKey = "SPEC_RANDOM_PERM_" + Math.round((100000 * Math.random()))
      let permKey2 = permKey + "-2"
      let permKey3 = permKey + "-3"
      let user = new AuthUser({
        $key: userKey,
        displayName: userKey
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
        userService.getGrantedPermissionsForUser(user).then((permissions: AuthPermission[]) => {
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
        .then(() => userService.create(user))
        .then(() => userService.grantPermission(user, permission))
        .then(() => userService.grantPermission(user, permission2))
        .then(() => userService.grantPermission(user, permission3))
        .then(start)
    })()
  })

  it('grants a role on a user', (done) => {
    inject([UserService, RoleService], (userService: UserService, roleService: RoleService) => {
      let userKey = "SPEC_RANDOM_USER" + Math.round((100000 * Math.random()))
      let roleKey = "SPEC_RANDOM_ROLE" + Math.round((100000 * Math.random()))

      let user = new AuthUser({
        $key: userKey,
        displayName: userKey
      })
      let testRole = new AuthRole({
        $key: roleKey,
        description: "A spec role."
      })

      roleService.create(testRole)
        .then(() => userService.create(user))
        .then(() => userService.grantRole(user, testRole))
        .then(() => userService.getRolesForUser(user))
        .then((roles: AuthRole[]) => expect(roles.some(perm => perm.$key === testRole.$key)).toBeTruthy())
        .then(() => userService.revokeRole(user, testRole))
        .then(() => done())
        .catch((reason) => {
          fail(reason);
          done()
        })
    })()
  })

  it('revokes a role on a user', (done) => {
    inject([UserService, RoleService], (userService: UserService, roleService: RoleService) => {
      let userKey = "SPEC_RANDOM_USER" + Math.round((100000 * Math.random()))
      let roleKey = "SPEC_RANDOM_ROLE" + Math.round((100000 * Math.random()))

      let user = new AuthUser({
        $key: userKey,
        displayName: userKey
      })
      let testRole = new AuthRole({
        $key: roleKey,
        description: "A spec role."
      })

      roleService.create(testRole)
        .then(() => userService.create(user))
        .then(() => userService.grantRole(user, testRole))
        .then(() => userService.getRolesForUser(user))
        .then((roles: AuthRole[]) => expect(roles.some(perm => perm.$key === testRole.$key)).toBeTruthy())
        .then(() => userService.revokeRole(user, testRole))
        .then(() => userService.getRolesForUser(user))
        .then((perms: AuthRole[]) => {
          expect(perms.some(perm => perm.$key === testRole.$key)).toBeFalsy()
        })
        .then(() => done())
        .catch((reason) => {
          fail(reason);
          done()
        })
    })()
  })

  xit('removes a role from a user when the role is deleted', (done) => {
    inject([UserService, RoleService], (userService: UserService, roleService: RoleService) => {

      let userKey = "SPEC_RANDOM_USER_" + Math.round((100000 * Math.random()))
      let roleKey = "SPEC_RANDOM_ROLE_" + Math.round((100000 * Math.random()))
      let roleKey2 = roleKey + "-2"
      let roleKey3 = roleKey + "-3"
      let user = new AuthUser({
        $key: userKey,
        displayName: userKey
      })
      let role = new AuthRole({
        $key: roleKey,
        description: "A spec role - " + roleKey
      })
      let role2 = new AuthRole({
        $key: roleKey2,
        description: "A spec role - " + roleKey2
      })
      let role3 = new AuthRole({
        $key: roleKey3,
        description: "A spec role - " + roleKey3
      })

      let count = 0
      let start = () => {
        userService.getRolesForUser(user).then((roles: AuthRole[]) => {
          let map = ObjMapUtil.fromKeyedEntityArray(roles)
          if (count === 0) {
            expect(roles.length).toBe(3)
            expect(map[roleKey]).toBeTruthy('Perm1 should be assigned')
            expect(map[roleKey2].description).toBe(role2.description)
            roleService.remove(roleKey).then((result) => {
              expect(result).toBe(roleKey)
            })
          }
          if (count === 1) {
            expect(roles.length).toBe(2)
            expect(map[roleKey]).toBeFalsy('Perm1 should NOT be assigned')
            expect(map[roleKey2].description).toBe(role2.description)
            roleService.remove(roleKey2).then(() => roleService.remove(roleKey3)).then(() => done())
          }
          count++
        })
      }

      roleService.create(role)
        .then(() => roleService.create(role2))
        .then(() => roleService.create(role3))
        .then(() => userService.create(user))
        .then(() => userService.grantRole(user, role))
        .then(() => userService.grantRole(user, role2))
        .then(() => userService.grantRole(user, role3))
        .then(start)
    })()
  })
});
