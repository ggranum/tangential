import {ObjMap} from '@tangential/core'
//noinspection TypeScriptPreferShortImport
import {VisitorPreferencesDm} from '../doc-model/visitor-preferences';

export class VisitorPreferences {
  hideCookieWarnings?: boolean = false
  hiddenTips?: ObjMap<boolean> = {}

  constructor() {
  }

  shouldShowTip(preferenceId: string) {
    return this.hiddenTips[preferenceId] !== true
  }

  hideTip(preferenceId: string) {
    this.hiddenTips[preferenceId] = true
  }

  toDocModel():VisitorPreferencesDm{
    return {
      hideCookieWarnings: this.hideCookieWarnings,
      hiddenTips: Object.assign({}, this.hiddenTips)
    }
  }

  static forGuest() {
    return new VisitorPreferences()
  }

}

export class VisitorPreferencesTransform {

  static fromDocModel(json:VisitorPreferencesDm):VisitorPreferences {
    json = json || {}
    let prefs = new VisitorPreferences()
    prefs.hideCookieWarnings = json.hideCookieWarnings || false
    prefs.hiddenTips = json.hiddenTips || {}
    return prefs
  }
}
