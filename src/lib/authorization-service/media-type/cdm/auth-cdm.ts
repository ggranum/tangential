import {ObjectUtil, ObjMapUtil} from '@tangential/core'
import {AuthDocModel} from '../auth/auth-doc-model'
import {PermissionCdm} from './permission-cdm'
import {RoleCdm} from './role-cdm'
import {UserCdm} from './user-cdm'


export class AuthCdm {

  users: UserCdm[]
  permissions: PermissionCdm[]
  roles: RoleCdm[]

}


export class AuthCdmTransform {

  static fromDocModel(docModel: AuthDocModel): AuthCdm {

    const cdm = new AuthCdm()
    cdm.permissions = ObjectUtil.entries(docModel.permissions).map(entry => PermissionCdm.fromDocModel(entry.key, entry.value))
    const permMap = ObjMapUtil.fromKeyedEntityArray(cdm.permissions)
    cdm.roles = ObjectUtil.entries(docModel.roles).map(
      entry => RoleCdm.fromDocModel(entry.key, entry.value, docModel.role_permissions[entry.key], permMap))
    const roleMap = ObjMapUtil.fromKeyedEntityArray(cdm.roles)

    cdm.users = ObjectUtil.entries(docModel.users).map(
      userEntry => UserCdm.fromDocModel(userEntry.key,
        userEntry.value,
        docModel.user_permissions[userEntry.key],
        docModel.user_roles[userEntry.key],
        permMap,
        roleMap))

    return cdm
  }
}
