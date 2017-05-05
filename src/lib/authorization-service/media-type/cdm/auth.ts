import {ObjectUtil, ObjMap, ObjMapUtil} from '@tangential/core';
import {AuthDm} from '../doc-model/auth';
import {AuthPermission} from './auth-permission';
import {AuthRole} from './auth-role';
import {AuthPermissionKey} from '../doc-model/auth-permission';
import {AuthUser, AuthUserTransform} from './auth-user';
import {AuthRoleTransform} from "./auth-role";
import {AuthPermissionTransform} from './auth-permission';
import {AuthConfigurationDm} from '../doc-model/auth-configuration';
import {AuthSettingsDm} from '../doc-model/auth-settings';

export class AuthConfiguration {
  defaultAnonymousRole: AuthPermissionKey
  defaultUserRole: AuthPermissionKey

  constructor(cfg?: any) {
    cfg = cfg || {}
    this.defaultAnonymousRole = cfg.defaultAnonymousRole || null
    this.defaultUserRole = cfg.defaultUserRole || null
  }

  static fromDocModel(configuration: AuthConfigurationDm) {
    return new AuthConfiguration(configuration)
  }
}

export class Auth {

  constructor(public permissions: AuthPermission[],
              public roles: AuthRole[],
              public configuration: AuthConfiguration,
              public users?: AuthUser[]) {
  }

  permissionsMap() {
    return ObjMapUtil.fromKeyedEntityArray(this.permissions)
  }

  rolesMap() {
    return ObjMapUtil.fromKeyedEntityArray(this.roles)
  }
}

export class AuthTransform {

  static fromDocModel(docModel: AuthDm): Auth {
    const cdm = AuthTransform.fragmentFromDocModel(docModel.settings)
    const users = AuthUserTransform.fromDocModels(
      docModel.users,
      docModel.ep,
      docModel.grantedPermissions,
      docModel.grantedRoles,
      cdm)
    return new Auth(cdm.permissions, cdm.roles, cdm.configuration, users)
  }

  static fragmentFromDocModel(settingsDm: AuthSettingsDm): Auth {
    const permissions: AuthPermission[] = AuthTransform.permissionsFromDocModel(settingsDm)
    const permMap = ObjMapUtil.fromKeyedEntityArray(permissions)
    const roles: AuthRole[] = AuthTransform.rolesFromDocModel(settingsDm, permMap)
    const configuration = AuthTransform.configurationFromDocModel(settingsDm)
    return  new Auth(permissions, roles, configuration)
  }

  private static permissionsFromDocModel(docModel: AuthSettingsDm) {
    return ObjectUtil.entries(docModel.permissions).map(entry => AuthPermissionTransform.fromDocModel(entry.value, entry.key))
  }

  private static rolesFromDocModel(docModel: AuthSettingsDm, permMap: ObjMap<AuthPermission>) {
    return ObjectUtil.entries(docModel.roles).map(
      entry => AuthRoleTransform.fromDocModel(entry.value, entry.key, docModel.rolePermissions[entry.key], permMap))
  }


  private static configurationFromDocModel(docModel: AuthSettingsDm) {
    return AuthConfiguration.fromDocModel(docModel.configuration)
  }
}
