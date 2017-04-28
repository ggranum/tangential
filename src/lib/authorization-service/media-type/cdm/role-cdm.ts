import {ObjectUtil, ObjMap} from '@tangential/core'
import {AuthRoleJson} from '../auth/auth-role'
import {PermissionCdm} from './permission-cdm'
export class RoleCdm {

  $key: string
  permissions: PermissionCdm[]
  description: string
  createdMils: number
  editedMils: number
  orderIndex: number


  constructor($key?: string) {
    this.$key = $key
  }

  static fromDocModel(key: string,
                      dm: AuthRoleJson,
                      rolePermissions: { [permissionKey: string]: boolean },
                      allPermissions: ObjMap<PermissionCdm>): RoleCdm {
    const cdm = new RoleCdm(key)
    cdm.description = dm.description
    cdm.orderIndex = dm.orderIndex
    cdm.createdMils = dm.createdMils
    cdm.editedMils = dm.editedMils
    cdm.permissions = ObjectUtil.keys(rolePermissions).map(permKey => allPermissions[permKey])
    return cdm
  }
}
