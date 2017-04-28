import {AuthPermissionJson} from '../auth/auth-permission'
export class PermissionCdm {

  $key: string
  description: string
  editedMils: number
  createdMils: number
  orderIndex: number


  constructor($key?: string) {
    this.$key = $key
  }

  static fromDocModel(key: string, dm: AuthPermissionJson): PermissionCdm {
    const cdm = new PermissionCdm(key)
    cdm.description = dm.description
    cdm.orderIndex = dm.orderIndex
    cdm.createdMils = dm.createdMils
    cdm.editedMils = dm.editedMils
    return cdm
  }
}
