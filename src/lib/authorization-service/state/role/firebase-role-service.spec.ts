/* tslint:disable:no-unused-variable */
import {inject, TestBed} from '@angular/core/testing'
import {
  AuthPermission,
  AuthRole,
  AuthService,
  FirebaseAuthService,
  FirebasePermissionService,
  FirebaseRoleService,
  FirebaseUserService,
  PermissionService,
  RoleService,
  UserService
} from '@tangential/authorization-service'
import {ObjMapUtil} from '@tangential/core'
import {FirebaseConfig, FirebaseProvider} from '@tangential/firebase-util'
import {environment} from '../../../../environments/environment.dev'
import {TestConfiguration} from '../test-config.spec'
import {cleanupPermissions, cleanupRoles} from '../test-setup.spec'


jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000

describe('Auth-services.role.state', () => {
  beforeEach((done) => {

    TestBed.configureTestingModule({
      declarations: [],
      imports:      [],
      providers:    [
        {provide: TestConfiguration, useClass: TestConfiguration},
        {provide: FirebaseConfig, useValue: environment.firebaseConfig},
        {provide: FirebaseProvider, useClass: FirebaseProvider},
        {provide: RoleService, useClass: FirebaseRoleService},
        {provide: PermissionService, useClass: FirebasePermissionService},
        {provide: AuthService, useClass: FirebaseAuthService},
        {provide: UserService, useClass: FirebaseUserService},
      ]
    })

    inject([TestConfiguration, AuthService, RoleService],
      (testConfig: TestConfiguration, visitorService: AuthService, roleService: RoleService) => {
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
      service.roles$().subscribe((roles) => {
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

      const key = 'SPEC_RANDOM_' + Math.round((100000 * Math.random()))
      const role = new AuthRole({
        $key:        key,
        description: 'Using firebaseRole Service in spec. ',
        orderIndex:  -1
      })
      service.create(role).then(() => {
        expect(role).toBeTruthy('Should have provided the updated value.')
        expect(role.$key).toBe(key)
        done()
      })
    })()
  })


  it('updates a Role', (done) => {
    inject([RoleService], (service: RoleService) => {
      const key = 'SPEC_RANDOM_' + Math.round((100000 * Math.random()))
      const description = 'Using firebaseRole Service in spec.'
      const updatedDescription = 'Using firebaseRole Service in spec - updated.'

      const primary = new AuthRole({
        $key:        key,
        description: description,
        orderIndex:  -1
      })
      const updated = new AuthRole(primary)
      updated.description = updatedDescription

      service.create(primary)
        .then(() => expect(primary.$key).toBe(key))
        .then(() => service.update(updated, primary))
        .then(() => service.value(key))
        .then((updatedRole) => {
          expect(updatedRole.description).toBe(updatedDescription, 'Should have updated the role.')
          done()
        }).catch((e) => fail())
    })()
  })

  it('removes a Role', (done) => {
    inject([RoleService], (service: RoleService) => {
      const key = 'SPEC_RANDOM_' + Math.round((100000 * Math.random()))

      const testRole = new AuthRole({
        $key:        key,
        description: 'Using firebaseRole Service in spec. ',
        orderIndex:  -1
      })
      service.create(testRole).then(() => expect(testRole.$key).toBe(key))
        .then(() => service.remove(key)).catch((e) => fail())
        .then(() => service.value(key)).catch((e) => fail())
        .then((removed) => {
          expect(removed).toBeFalsy('Removed values should be null on read.')
          done()
        }).catch((e) => fail())
        .catch(() => {
          fail('should return null value rather than fail.')
        })

    })()
  })

  it('grants a permission on a role', (done) => {
    inject([RoleService, PermissionService], (roleService: RoleService, permissionService: PermissionService) => {
      const roleKey = 'SPEC_RANDOM_ROLE' + Math.round((100000 * Math.random()))
      const permKey = 'SPEC_RANDOM_PERM' + Math.round((100000 * Math.random()))

      const role = new AuthRole({
        $key:        roleKey,
        description: 'A spec role.'
      })
      const permission = new AuthPermission({
        $key:        permKey,
        description: 'A spec permission.'
      })
      permissionService.create(permission)
        .then(() => roleService.create(role)).catch((e) => fail())
        .then(() => roleService.grantPermission(role, permission)).catch((e) => fail())
        .then(() => roleService.getPermissionsForRole(role)).catch((e) => fail())
        .then((perms: AuthPermission[]) => {
          const map = ObjMapUtil.fromKeyedEntityArray(perms)
          expect(map[permission.$key]).toBeTruthy()
        }).catch((e) => fail())
        .then(() => roleService.revokePermission(role, permission)).catch((e) => fail())
        .then(() => done())
        .catch((e) => {
          console.log('Error', e)
          fail()
        })
    })()
  })

  it('revokes a permission on a role', (done) => {
    inject([RoleService, PermissionService], (roleService: RoleService, permissionService: PermissionService) => {
      const roleKey = 'SPEC_RANDOM_ROLE' + Math.round((100000 * Math.random()))
      const permKey = 'SPEC_RANDOM_PERM' + Math.round((100000 * Math.random()))

      const role = new AuthRole({
        $key:        roleKey,
        description: 'A spec role.'
      })
      const permission = new AuthPermission({
        $key:        permKey,
        description: 'A spec permission.'
      })

      permissionService.create(permission)
        .then(() => roleService.create(role)).catch((e) => fail())
        .then(() => roleService.grantPermission(role, permission)).catch((e) => fail())
        .then(() => roleService.revokePermission(role, permission)).catch((e) => fail())
        .then(() => roleService.getPermissionsForRole(role)).catch((e) => fail())
        .then((perms: AuthPermission[]) => {
          const map = ObjMapUtil.fromKeyedEntityArray(perms)
          expect(map[permission.$key]).toBeFalsy()
        }).catch((e) => fail())
        .then(() => roleService.revokePermission(role, permission)).catch((e) => fail())
        .then(() => done()).catch((e) => fail())
    })()
  })

  xit('removes a permission from a role when the permission is deleted', (done) => {
    inject([RoleService, PermissionService], (roleService: RoleService, permissionService: PermissionService) => {

      const roleKey = 'SPEC_RANDOM_ROLE_' + Math.round((100000 * Math.random()))
      const permKey = 'SPEC_RANDOM_PERM_' + Math.round((100000 * Math.random()))
      const permKey2 = permKey + '-2'
      const permKey3 = permKey + '-3'
      const role = new AuthRole({
        $key:        roleKey,
        description: 'A spec role.'
      })
      const permission = new AuthPermission({
        $key:        permKey,
        description: 'A spec permission - ' + permKey
      })
      const permission2 = new AuthPermission({
        $key:        permKey2,
        description: 'A spec permission - ' + permKey2
      })
      const permission3 = new AuthPermission({
        $key:        permKey3,
        description: 'A spec permission - ' + permKey3
      })

      let count = 0
      const start = () => {
        roleService.getPermissionsForRole$(role).subscribe((permissions: AuthPermission[]) => {
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
        .then(() => roleService.create(role))
        .then(() => roleService.grantPermission(role, permission))
        .then(() => roleService.grantPermission(role, permission2))
        .then(() => roleService.grantPermission(role, permission3))
        .then(start)
    })()
  })
});
