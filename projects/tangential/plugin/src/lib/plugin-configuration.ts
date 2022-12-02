/**
 * Static configuration for the plugin.
 * Defines where in the database the plugin settings get stored, permissions the plugin ads, etc.
 */
import {PluginAuth} from './plugin-auth'

export interface PluginConfiguration {
  /**
   * A human readable name for the plugin. May contain spaces etc.
   */
  name: string

  /**
   * A database friendly identifier for this plugin. This specifies the location that the plugin's configurable settings will live.
   * At least, this is the case for Firebase. Non-document based database implementors, should any be come along,
   * will need to determine what works best for their own schema.
   */
  id: string

  auth:PluginAuth

}
