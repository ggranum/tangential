/* tslint:disable:no-unused-variable */
import {inject, TestBed} from '@angular/core/testing';
import {
  AuthPermission, AuthRole, AuthService, AuthUser,
  FirebaseAuthService,
  FirebasePermissionService,
  FirebaseRoleService,
  FirebaseUserService,
  PermissionService,
  RoleService,
  UserService
} from '@tangential/authorization-service';
import {ObjMapUtil} from '@tangential/core';


import {FirebaseConfig, FirebaseProvider} from '@tangential/firebase-util';
import {environment} from '../../../../environments/environment.dev';
import {TestConfiguration} from '../test-config.spec';
import {cleanupPermissions, cleanupRoles, cleanupUsers} from '../test-setup.spec';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000

describe('Auth-services.user.state', () => {
  beforeEach((done) => {

    TestBed.configureTestingModule({
      declarations: [],
      imports:      [],
      providers:    [
        {provide: TestConfiguration, useClass: TestConfiguration},
        {provide: FirebaseConfig, useValue: environment.firebaseConfig},
        {provide: FirebaseProvider, useClass: FirebaseProvider},
        {provide: UserService, useClass: FirebaseUserService},
        {provide: PermissionService, useClass: FirebasePermissionService},
        {provide: RoleService, useClass: FirebaseRoleService},
        {provide: AuthService, useClass: FirebaseAuthService},
      ]
    })

    inject([TestConfiguration, AuthService, UserService], (testConfig: TestConfiguration, authService: AuthService) => {
      authService.signInWithEmailAndPassword(testConfig.adminCredentials).then(done)
    })()
  })

  afterEach((done) => {
    inject([PermissionService, RoleService, UserService],
      (permissionService: PermissionService, roleService: RoleService, userService: UserService) => {
        permissionService.destroy()
        roleService.destroy()
        userService.destroy()
        done()
      })()
  })


  afterAll((done) => {
    inject([PermissionService, RoleService, UserService],
      (permissionService: PermissionService, roleService: RoleService, userService: UserService) => {
        cleanupPermissions(permissionService).then(() => cleanupRoles(roleService)).then(() => cleanupUsers(userService)).then(done)
      })()
  })

  it('load users from User Service', (done) => {
    inject([UserService], (service: UserService) => {
      service.awaitUsers$().subscribe((users) => {
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

      const key = 'SPEC_RANDOM_USER' + Math.round((100000 * Math.random()))
      const user = AuthUser.from({
        $key:        key,
        displayName: key
      })
      service.create(user).then(() => {
        expect(user).toBeTruthy('Should have provided the updated value.')
        expect(user.$key).toBe(key)
        done()
      })
    })()
  })


  it('updates a User', (done) => {
    inject([UserService], (service: UserService) => {
      const key = 'SPEC_RANDOM_USER' + Math.round((100000 * Math.random()))
      const updatedDisplayName = 'updated'
      const changeCount = 0

      const primary = AuthUser.from({
        $key:        key,
        displayName: key,
      })
      const updated = AuthUser.from(primary)
      updated.displayName = updatedDisplayName

      service.create(primary)
        .then(() => expect(primary.$key).toBe(key)).catch((e) => fail())
        .then(() => service.update(updated)).catch((e) => fail())
        .then(() => service.getUserFragment(key)).catch((e) => <any>fail())
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
      const key = 'SPEC_RANDOM_USER' + Math.round((100000 * Math.random()))
      const testUser = AuthUser.from({
        $key:        key,
        displayName: key,
      })
      service.create(testUser).then(() => expect(testUser.$key).toBe(key))
        .then(() => service.remove(key))
        .then((removedKey) => service.getUserFragment(key))
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
      const userKey = 'SPEC_RANDOM_USER' + Math.round((100000 * Math.random()))
      const permKey = 'SPEC_RANDOM_PERM' + Math.round((100000 * Math.random()))

      const user = AuthUser.from({
        $key:        userKey,
        displayName: userKey
      })
      const permission = AuthPermission.from({
        $key:        permKey,
        description: 'A spec permission.'
      })

      permissionService.create(permission)
        .then(() => userService.create(user))
        .then(() => userService.grantPermission(user, permission))
        .then(() => userService.getUser(user.$key)).then(user => user.effectivePermissions)
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
      const userKey = 'SPEC_RANDOM_USER' + Math.round((100000 * Math.random()))
      const permKey = 'SPEC_RANDOM_PERM' + Math.round((100000 * Math.random()))

      const user = AuthUser.from({
        $key:        userKey,
        displayName: userKey
      })
      const permission = AuthPermission.from({
        $key:        permKey,
        description: 'A spec permission.'
      })

      permissionService.create(permission)
        .then(() => userService.create(user))
        .then(() => userService.grantPermission(user, permission))
        .then(() => userService.getUser(user.$key)).then(result => result.effectivePermissions)
        .then((perms: AuthPermission[]) => {
          expect(perms.some(perm => perm.$key === permission.$key)).toBeTruthy()
        })
        .then(() => userService.revokePermission(user, permission))
        .then(() => userService.getUser(user.$key)).then(result => result.effectivePermissions)
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

      const userKey = 'SPEC_RANDOM_USER_' + Math.round((100000 * Math.random()))
      const permKey = 'SPEC_RANDOM_PERM_' + Math.round((100000 * Math.random()))
      const permKey2 = permKey + '-2'
      const permKey3 = permKey + '-3'
      const user = AuthUser.from({
        $key:        userKey,
        displayName: userKey
      })
      const permission = AuthPermission.from({
        $key:        permKey,
        description: 'A spec permission - ' + permKey
      })
      const permission2 = AuthPermission.from({
        $key:        permKey2,
        description: 'A spec permission - ' + permKey2
      })
      const permission3 = AuthPermission.from({
        $key:        permKey3,
        description: 'A spec permission - ' + permKey3
      })

      let count = 0
      const start = () => {
        userService.getUser(user.$key).then(result => result.grantedPermissions).then((permissions: AuthPermission[]) => {
          const map = ObjMapUtil.fromKeyedEntityArray(permissions)
          if (count === 0) {
            expect(permissions.length).toBe(3)
            expect(map[permKey]).toBeTruthy('Perm1 should be assigned')
            expect(map[permKey2].description).toBe(permission2.description)
            permissionService.remove(permKey).then(() => {
              expect(permKey).toBe(permKey)
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
      const userKey = 'SPEC_RANDOM_USER' + Math.round((100000 * Math.random()))
      const roleKey = 'SPEC_RANDOM_ROLE' + Math.round((100000 * Math.random()))

      const user = AuthUser.from({
        $key:        userKey,
        displayName: userKey
      })
      const testRole = AuthRole.from({
        $key:        roleKey,
        description: 'A spec role.'
      })

      roleService.create(testRole)
        .then(() => userService.create(user))
        .then(() => userService.grantRole(user, testRole))
        .then(() => userService.getUser(user.$key)).then(result => result.grantedRoles)
        .then((roles: AuthRole[]) => expect(roles.some(perm => perm.$key === testRole.$key)).toBeTruthy())
        .then(() => userService.revokeRole(user.$key, testRole.$key))
        .then(() => done())
        .catch((reason) => {
          fail(reason);
          done()
        })
    })()
  })

  it('revokes a role on a user', (done) => {
    inject([UserService, RoleService], (userService: UserService, roleService: RoleService) => {
      const userKey = 'SPEC_RANDOM_USER' + Math.round((100000 * Math.random()))
      const roleKey = 'SPEC_RANDOM_ROLE' + Math.round((100000 * Math.random()))

      const user = AuthUser.from({
        $key:        userKey,
        displayName: userKey
      })
      const testRole = AuthRole.from({
        $key:        roleKey,
        description: 'A spec role.'
      })

      roleService.create(testRole)
        .then(() => userService.create(user))
        .then(() => userService.grantRole(user, testRole))
        .then(() => userService.getUser(user.$key)).then(result => result.grantedRoles)
        .then((roles: AuthRole[]) => expect(roles.some(perm => perm.$key === testRole.$key)).toBeTruthy())
        .then(() => userService.revokeRole(user.$key, testRole.$key))
        .then(() => userService.getUser(user.$key)).then(result => result.grantedRoles)
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

      const userKey = 'SPEC_RANDOM_USER_' + Math.round((100000 * Math.random()))
      const roleKey = 'SPEC_RANDOM_ROLE_' + Math.round((100000 * Math.random()))
      const roleKey2 = roleKey + '-2'
      const roleKey3 = roleKey + '-3'
      const user = AuthUser.from({
        $key:        userKey,
        displayName: userKey
      })
      const role = AuthRole.from({
        $key:        roleKey,
        description: 'A spec role - ' + roleKey
      })
      const role2 = AuthRole.from({
        $key:        roleKey2,
        description: 'A spec role - ' + roleKey2
      })
      const role3 = AuthRole.from({
        $key:        roleKey3,
        description: 'A spec role - ' + roleKey3
      })

      let count = 0
      const start = () => {
        userService.getUser(user.$key).then(result => result.grantedRoles).then((roles: AuthRole[]) => {
          const map = ObjMapUtil.fromKeyedEntityArray(roles)
          if (count === 0) {
            expect(roles.length).toBe(3)
            expect(map[roleKey]).toBeTruthy('Perm1 should be assigned')
            expect(map[roleKey2].description).toBe(role2.description)
            roleService.remove(roleKey).then((result) => {
              // probably broken
              expect(roleKey2).toBe(roleKey)
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
