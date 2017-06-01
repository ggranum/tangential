import {
  PermissionsByKey,
  PluginAuth
} from './plugin-auth'
import {PluginSettings} from './plugin-settings'

export abstract class TangentialPlugin {


  constructor(public auth: PluginAuth, public settings: PluginSettings) {
  }

  abstract getPermissions(): PermissionsByKey
}
