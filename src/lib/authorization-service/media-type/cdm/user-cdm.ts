import {ObjectUtil, ObjMap} from '@tangential/core'
import {AuthSubjectDocModel} from '../auth/auth-user'
import {PermissionCdm} from './permission-cdm'
import {RoleCdm} from './role-cdm'
export class UserCdm {

  $key: string
  permissions: PermissionCdm[]
  roles: RoleCdm[]
  email: string
  displayName: string
  isAnonymous: boolean
  lastSignInMils: number
  lastSignInIp: string
  emailVerified: boolean
  createdMils: number
  editedMils: number
  disabled: boolean

  constructor(key?: string) {
    this.$key = key
  }

  static fromDocModel(key: string,
                      dm: AuthSubjectDocModel,
                      userPermissions: { [permKey: string]: boolean },
                      userRoles: { [roleKey: string]: boolean },
                      allPermissions: ObjMap<PermissionCdm>,
                      allRoles: ObjMap<RoleCdm>): UserCdm {

    const cdm = new UserCdm(key)
    cdm.email = dm.email
    cdm.displayName = dm.displayName
    cdm.isAnonymous = dm.isAnonymous
    cdm.lastSignInMils = dm.lastSignInMils
    cdm.lastSignInIp = dm.lastSignInIp
    cdm.emailVerified = dm.emailVerified
    cdm.createdMils = dm.createdMils
    cdm.editedMils = dm.editedMils
    cdm.disabled = dm.disabled

    cdm.permissions = ObjectUtil.keys(userPermissions).map(permKey => allPermissions[permKey])
    cdm.roles = ObjectUtil.keys(userRoles).map(roleKey => allRoles[roleKey])

    return cdm
  }
}
