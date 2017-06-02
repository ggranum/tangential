import {
  AdminService,
  AuthSubject
} from '@tangential/authorization-service'
import {
  ObjectUtil,
  ResolveVoid
} from '@tangential/core'
import {TangentialPlugin} from '../plugin'

export abstract class PluginService {

  constructor(protected adminService: AdminService) { }

  install(subject:AuthSubject, plugin: TangentialPlugin): Promise<void> {
    return Promise.all([
      this.savePluginState(subject, plugin),
      this.installPermissions(subject, plugin),
      this.grantPermissionsToCurrentAdmin(subject, plugin),

    ]).then(() => ResolveVoid)
  }

  protected installPermissions(subject:AuthSubject, plugin: TangentialPlugin): Promise<void> {
    let permMap = plugin.configuration.auth.getPermissions()
    let promises: Promise<void>[] =ObjectUtil.keys(permMap).map(key => this.adminService.addPermission(permMap[key]))
    return Promise.all(promises).then(() => ResolveVoid)
  }

  protected grantPermissionsToCurrentAdmin(subject:AuthSubject, plugin: TangentialPlugin): Promise<void> {
    let permMap = plugin.configuration.auth.getPermissions()
    let promises: Promise<void>[] = ObjectUtil.keys(permMap).map(key => this.adminService.grantPermissionOnUser(subject, permMap[key] ))
    return Promise.all(promises).then(() => ResolveVoid)
  }

  protected abstract savePluginState(subject:AuthSubject, plugin: TangentialPlugin): Promise<void>
}
