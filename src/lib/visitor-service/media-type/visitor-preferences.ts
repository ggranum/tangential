import {Jsonified, ObjectUtil, ObjMap} from '@tangential/core'
import {StampedMediaType} from '@tangential/media-types'

export interface VisitorPreferencesJson {
  hideCookieWarnings?: boolean
  hiddenTips?: ObjMap<boolean>
}

const Model: VisitorPreferencesJson = {
  hideCookieWarnings: false, hiddenTips: {}
}

export class VisitorPreferences extends StampedMediaType
  implements Jsonified<VisitorPreferences, VisitorPreferencesJson>, VisitorPreferencesJson {
  static $model: VisitorPreferencesJson = ObjectUtil.assignDeep({}, StampedMediaType.$model, Model)
  hideCookieWarnings?: boolean
  hiddenTips?: ObjMap<boolean>

  constructor(config?: VisitorPreferencesJson) {
    super(config || {})
  }

  shouldShowTip(preferenceId: string) {
    return this.hiddenTips[preferenceId] !== true
  }

  hideTip(preferenceId: string) {
    this.hiddenTips[preferenceId] = true
  }

  static forGuest() {
    return new VisitorPreferences()
  }
}
