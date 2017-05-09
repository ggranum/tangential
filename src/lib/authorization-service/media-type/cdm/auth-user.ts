import {AuthUserDm, AuthUserKey} from '../doc-model/auth-user';
import {generatePushID, ObjectUtil, ObjMap} from '@tangential/core';
import {UserPermissionGrantsDm, UserRoleGrantsDm} from '../doc-model/auth';
import {AuthRole} from './auth-role';
import {AuthPermission} from './auth-permission';
import {AuthSettings} from './auth-settings';
import {SignInEvent} from './sign-in-event';
import {TransformUtil as TUtil} from '../../../core/util/transform-util';

export interface AuthUserCfg {
  $key?: string
  email?: string
  displayName?: string
  isAnonymous?: boolean
  lastSignInMils?: number
  lastSignInIp?: string
  emailVerified?: boolean
  createdMils?: number
  editedMils?: number
  disabled?: boolean
  effectivePermissions?: AuthPermission[]
  grantedPermissions?: AuthPermission[]
  grantedRoles?: AuthRole[]
}


/**
 * Conceptual data model for Auth User.
 *
 *
 *
 */
export class AuthUser {
  $key: string
  email: string = ''
  displayName: string = ''
  isAnonymous: boolean = true
  lastSignInMils: number = Date.now()
  lastSignInIp: string
  emailVerified: boolean = false
  createdMils: number = Date.now()
  editedMils: number = Date.now()
  disabled: boolean = false

  grantedRoles: AuthRole[] = []
  effectivePermissions: AuthPermission[] = []
  grantedPermissions: AuthPermission[] = []

  signInEvents: SignInEvent[]


  constructor(key?: string) {
    this.$key = key
  }

  public isAdministrator(): boolean {
    return this.hasRole('Administrator')
  }

  public hasRole(roleKey: string): boolean {
    return this.grantedRoles.some(role => role.$key === roleKey)
  }

  public hasRoles(roleKeys: string[]) {
    roleKeys = roleKeys || []
    return roleKeys.every(key => this.hasRole(key))
  }

  public hasPermission(permissionKey: string): boolean {
    return this.effectivePermissions.some(role => role.$key === permissionKey)
  }

  public hasPermissions(permissionKeys: string[]) {
    permissionKeys = permissionKeys || []
    return permissionKeys.every(key => this.hasPermission(key))
  }

  /**
   * Copy the source object to the target. Return the target for convenience.
   * @param source
   * @param target
   * @returns {AuthUser|AuthUserCfg} The populated target argument.
   */
  static copyTo<T extends AuthUser | AuthUserCfg>(source: AuthUser | AuthUserCfg, target: T): T {
    target.$key = source.$key || target.$key
    target.email = source.email || target.email
    target.displayName = source.displayName || target.displayName
    target.isAnonymous = TUtil.firstExisting(source.isAnonymous, target.isAnonymous)
    target.lastSignInMils = source.lastSignInMils || target.lastSignInMils
    target.lastSignInIp = source.lastSignInIp || target.lastSignInIp
    target.emailVerified = source.emailVerified || target.emailVerified
    target.createdMils = source.createdMils || target.createdMils
    target.editedMils = source.editedMils || target.editedMils
    target.disabled = source.disabled || target.disabled

    target.effectivePermissions = [].concat(source.effectivePermissions || [])
    target.grantedPermissions = [].concat(source.grantedPermissions || [])
    target.grantedRoles = [].concat(source.grantedRoles || [])

    return target
  }

  static from(cfg: AuthUser | AuthUserCfg, key?: AuthUserKey): AuthUser {
    cfg = cfg || {}
    key = key || cfg.$key || generatePushID()
    const user = new AuthUser(key)
    return AuthUser.copyTo(cfg, user)
  }
}


export class AuthUserTransform {

  static toDocModel(authUser: AuthUser): AuthUserDm {
    let dm = {
      email: authUser.email,
      displayName: authUser.displayName,
      isAnonymous: authUser.isAnonymous,
      lastSignInMils: authUser.lastSignInMils,
      lastSignInIp: authUser.lastSignInIp,
      emailVerified: authUser.emailVerified,
      createdMils: authUser.createdMils,
      editedMils: authUser.editedMils,
      disabled: authUser.disabled,
    }

    return ObjectUtil.removeNullish(dm)
  }

  static fromDocModels(subjects: ObjMap<AuthUserDm>,
                       effectivePermissions: UserPermissionGrantsDm,
                       grantedPermissions: UserPermissionGrantsDm,
                       grantedRoles: UserRoleGrantsDm,
                       authSettings: AuthSettings): AuthUser[] {
    const permMap = authSettings.permissionsMap()
    const roleMap = authSettings.rolesMap()
    return ObjectUtil.entries(subjects).map(
      subjectEntry => AuthUserTransform.fromDocModel(subjectEntry.key,
        subjectEntry.value,
        effectivePermissions[subjectEntry.key],
        grantedPermissions[subjectEntry.key],
        grantedRoles[subjectEntry.key],
        permMap,
        roleMap))
  }

  static fromDocModel(key: string,
                      dm: AuthUserDm,
                      effectivePermissionDms: { [permKey: string]: boolean },
                      grantedPermissionDms: { [permKey: string]: boolean },
                      userRoles: { [roleKey: string]: boolean },
                      allPermissions: ObjMap<AuthPermission>,
                      allRoles: ObjMap<AuthRole>): AuthUser {


    const effectivePermission = ObjectUtil.keys(effectivePermissionDms).map(permKey => allPermissions[permKey])
    const grantedPermission = ObjectUtil.keys(grantedPermissionDms).map(permKey => allPermissions[permKey])
    const roles = ObjectUtil.keys(userRoles).map(roleKey => allRoles[roleKey])

    return AuthUserTransform.fromDocModelAndCdms(key, dm, effectivePermission, grantedPermission, roles)
  }

  static fromDocModelAndCdms(key: string,
                             dm: AuthUserDm,
                             effectivePermissions: AuthPermission[],
                             grantedPermissions: AuthPermission[],
                             roles: AuthRole[]): AuthUser {

    const cdm = AuthUserTransform.fragmentFromDocModel(dm, key)

    cdm.effectivePermissions = effectivePermissions
    cdm.grantedPermissions = grantedPermissions
    cdm.grantedRoles = roles
    return cdm
  }

  static fragmentFromDocModel(dm: AuthUserDm, key?: AuthUserKey): AuthUser {
    dm = dm || {}
    key = key || dm.$key || generatePushID()
    const cdm = new AuthUser(key)
    cdm.email = TUtil.firstExisting(dm.email, cdm.email)
    cdm.displayName = TUtil.firstExisting(dm.displayName, cdm.displayName)
    cdm.isAnonymous = TUtil.firstExisting(dm.isAnonymous, cdm.isAnonymous)
    cdm.lastSignInMils = TUtil.firstExisting(dm.lastSignInMils, cdm.lastSignInMils)
    cdm.lastSignInIp = TUtil.firstExisting(dm.lastSignInIp, cdm.lastSignInIp)
    cdm.emailVerified = TUtil.firstExisting(dm.emailVerified, cdm.emailVerified)
    cdm.createdMils = TUtil.firstExisting(dm.createdMils, cdm.createdMils)
    cdm.editedMils = TUtil.firstExisting(dm.editedMils, cdm.editedMils)
    cdm.disabled = TUtil.firstExisting(dm.disabled, cdm.disabled, false)
    return cdm
  }

  static applyDocModelTo(source:AuthUserDm, target:AuthUser):AuthUser {
    target.email = TUtil.firstExisting(source.email, target.email)
    target.displayName = TUtil.firstExisting(source.displayName, target.displayName)
    target.isAnonymous = TUtil.firstExisting(source.isAnonymous, target.isAnonymous)
    target.lastSignInMils = TUtil.firstExisting(source.lastSignInMils, target.lastSignInMils)
    target.lastSignInIp = TUtil.firstExisting(source.lastSignInIp, target.lastSignInIp)
    target.emailVerified = TUtil.firstExisting(source.emailVerified, target.emailVerified)
    target.createdMils = TUtil.firstExisting(source.createdMils, target.createdMils)
    target.editedMils = TUtil.firstExisting(source.editedMils, target.editedMils)
    target.disabled = TUtil.firstExisting(source.disabled, target.disabled, false)

    return target
  }
}
