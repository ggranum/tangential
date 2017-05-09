import {ObjectUtil, ObjMap, ObjMapUtil} from '@tangential/core';
import {AuthPermission, AuthPermissionTransform} from './auth-permission';
import {AuthRole, AuthRoleTransform} from './auth-role';
import {AuthPermissionKey} from '../doc-model/auth-permission';
import {AuthConfigurationDm} from '../doc-model/auth-configuration';
import {AuthSettingsDm} from '../doc-model/auth-settings';
import {AuthRoleKey} from '../doc-model/auth-role';

export class AuthConfiguration {
  defaultAnonymousRole: AuthPermissionKey
  defaultUserRole: AuthPermissionKey

  constructor(cfg?: any) {
    cfg = cfg || {}
    this.defaultAnonymousRole = cfg.defaultAnonymousRole || null
    this.defaultUserRole = cfg.defaultUserRole || null
  }


}

export class AuthConfigurationTransform {
  static fromDocModel(configuration: AuthConfigurationDm):AuthConfiguration {
    return new AuthConfiguration(configuration)
  }

  static toDocModel(configuration:AuthConfiguration):AuthConfigurationDm {
    return {
      defaultAnonymousRole: configuration.defaultAnonymousRole,
      defaultUserRole: configuration.defaultUserRole
    }

  }
}

export class AuthSettings {

  constructor(public permissions: AuthPermission[],
              public roles: AuthRole[],
              public configuration: AuthConfiguration) {
  }

  permissionsMap() {
    return ObjMapUtil.fromKeyedEntityArray(this.permissions)
  }

  rolesMap() {
    return ObjMapUtil.fromKeyedEntityArray(this.roles)
  }

  permissionsForRoles(keys: AuthRoleKey[]):ObjMap<AuthPermission> {
    let rolesMap = this.rolesMap()
    let permissions: AuthPermission[] = []
    keys.forEach(key => {
      let role = rolesMap[key]
      permissions.concat(role.permissions)
    })
    return ObjMapUtil.fromKeyedEntityArray(permissions)

  }

  getRole(key: AuthRoleKey):AuthRole {
    return this.roles.find(role => key === role.$key)
  }

  getPermission(key: AuthPermissionKey):AuthPermission {
    return this.permissions.find(permission => key === permission.$key)
  }
}

export class AuthSettingsTransform {

  static fromDocModel(settingsDm: AuthSettingsDm): AuthSettings {
    const permissions: AuthPermission[] = AuthSettingsTransform.permissionsFromDocModel(settingsDm)
    const permMap = ObjMapUtil.fromKeyedEntityArray(permissions)
    const roles: AuthRole[] = AuthSettingsTransform.rolesFromDocModel(settingsDm, permMap)
    const configuration = AuthSettingsTransform.configurationFromDocModel(settingsDm)
    return new AuthSettings(permissions, roles, configuration)
  }

  private static permissionsFromDocModel(docModel: AuthSettingsDm) {
    return ObjectUtil.entries(docModel.permissions).map(entry => AuthPermissionTransform.fromDocModel(entry.value, entry.key))
  }

  private static rolesFromDocModel(docModel: AuthSettingsDm, permMap: ObjMap<AuthPermission>) {
    return ObjectUtil.entries(docModel.roles).map(
      entry => AuthRoleTransform.fromDocModel(entry.value, entry.key, docModel.rolePermissions[entry.key], permMap))
  }

  private static configurationFromDocModel(docModel: AuthSettingsDm) {
    return AuthConfigurationTransform.fromDocModel(docModel.configuration)
  }

  static toDocModel(cm: AuthSettings):AuthSettingsDm {
    const dm= <AuthSettingsDm>{}
    dm.permissions = ObjMapUtil.fromKeyedEntityArray(AuthPermissionTransform.toDocModels(cm.permissions))
    dm.roles = ObjMapUtil.fromKeyedEntityArray(AuthRoleTransform.toDocModels(cm.roles))
    dm.rolePermissions = AuthRoleTransform.toRolePermissionDocModels(cm.roles)
    dm.configuration = AuthConfigurationTransform.fromDocModel(cm.configuration)

    return dm
  }
}
