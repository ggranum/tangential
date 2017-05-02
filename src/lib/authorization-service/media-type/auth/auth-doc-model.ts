import {AuthPermissionJson} from './auth-permission';
import {AuthRoleJson} from './auth-role';
import {AuthSubjectDocModel} from './auth-user';


export class AuthSettingsDocModel {
  permissions: { [key: string]: AuthPermissionJson }
  roles: { [key: string]: AuthRoleJson }
  rolePermissions: { [roleKey: string]: { [permissionKey: string]: boolean } }
}


export class AuthDocModel {

  settings: AuthSettingsDocModel
  ep: { [uid: string]: { [permissionKey: string]: boolean } }
  subjects: { [uid: string]: AuthSubjectDocModel }
  subjectGrantedPermissions: { [uid: string]: { [permissionKey: string]: boolean } }
  subjectRoles: { [uid: string]: { [roleKey: string]: boolean } }


  constructor(model: AuthDocModel) {
    this.settings = !model.settings ? <any>{} :  {
      permissions: model.settings.permissions || {},
      roles: model.settings.roles || {},
      rolePermissions: model.settings.rolePermissions || {}
    }
    this.ep= model.ep || {}
    this.subjectGrantedPermissions= model.subjectGrantedPermissions || {}
    this.subjectRoles = model.subjectRoles || {}
    this.subjects= model.subjects || {}
  }
}
