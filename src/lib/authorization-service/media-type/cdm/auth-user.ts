import {AuthUserDm, AuthUserKey} from '../doc-model/auth-user';
import {generatePushID, ObjectUtil, ObjMap} from '@tangential/core';
import {UserPermissionGrantsDm, UserRoleGrantsDm} from '../doc-model/auth';
import {Auth} from './auth';
import {AuthRole} from './auth-role';
import {AuthPermission} from './auth-permission';
import {SignInEvent} from '@tangential/authorization-service';

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
  static copyTo<T extends AuthUser| AuthUserCfg>(source:AuthUser | AuthUserCfg, target:T):T{
    target.$key = source.$key || target.$key
    target.email = source.email || target.email
    target.displayName = source.displayName || target.displayName
    target.isAnonymous = ObjectUtil.firstDefined(source.isAnonymous, target.isAnonymous)
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

  static from(cfg: AuthUser | AuthUserCfg, key?:AuthUserKey):AuthUser {
    cfg = cfg || {}
    key = key || cfg.$key || generatePushID()
    const user = new AuthUser(key)
    return AuthUser.copyTo(cfg, user)
  }
}


export class AuthUserTransform {

  static toDocModel(authUser: AuthUser): AuthUserDm {
    return {
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
  }

  static fromDocModels(subjects: ObjMap<AuthUserDm>,
                       effectivePermissions: UserPermissionGrantsDm,
                       grantedPermissions: UserPermissionGrantsDm,
                       grantedRoles: UserRoleGrantsDm,
                       authCdm: Auth): AuthUser[] {
    const permMap = authCdm.permissionsMap()
    const roleMap = authCdm.rolesMap()
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
    cdm.grantedRoles= roles
    return cdm
  }

  static fragmentFromDocModel(dm: AuthUserDm, key?: AuthUserKey): AuthUser {
    dm = dm || {}
    key = key || dm.$key || generatePushID()
    const cdm = new AuthUser(key)
    cdm.email = dm.email
    cdm.displayName = dm.displayName
    cdm.isAnonymous = dm.isAnonymous
    cdm.lastSignInMils = dm.lastSignInMils
    cdm.lastSignInIp = dm.lastSignInIp
    cdm.emailVerified = dm.emailVerified
    cdm.createdMils = dm.createdMils
    cdm.editedMils = dm.editedMils
    cdm.disabled = dm.disabled
    return cdm
  }
}
