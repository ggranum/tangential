import {ObjMap} from '@tangential/core'
//noinspection TypeScriptPreferShortImport
import {VisitorPreferencesDm} from '../doc-model/visitor-preferences';

export class VisitorPreferencesCdm {
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
    return new VisitorPreferencesCdm()
  }

  static from(json:VisitorPreferencesDm):VisitorPreferencesCdm {
    let prefs = new VisitorPreferencesCdm()
    prefs.hideCookieWarnings = json.hideCookieWarnings || false
    prefs.hiddenTips = json.hiddenTips || {}
    return prefs
  }
}
