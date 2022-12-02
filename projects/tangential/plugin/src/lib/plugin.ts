import {
  PermissionsByKey,
  PluginAuth
} from './plugin-auth'
import {PluginSettings} from './plugin-settings'
// noinspection ES6PreferShortImport
import {PluginConfiguration} from './plugin-configuration'

export abstract class TangentialPlugin {


  constructor(public settings: PluginSettings, public configuration:PluginConfiguration) {
  }

  /**
   * Convenience method for accessing the auth instance.
   * @returns {PluginAuth}
   */
  auth():PluginAuth{
    return this.configuration.auth
  }
}
