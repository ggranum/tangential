import {
  Jsonified,
  ObjectUtil
} from '@tangential/core'
//noinspection ES6PreferShortImport
import {
  DurationType,
  DurationTypeJson
} from '../../data-type/duration/duration-type'
import {
  InputConfig,
  InputConfigJson
} from '../../input-config'

export interface DurationFieldShowingState {
  day?: boolean
  h?: boolean
  min?: boolean
  s?: boolean
  ms?: boolean
}

export interface DurationPickerConfigIF extends InputConfigJson {
  labelPosition?: 'before' | 'after' | 'below'
  showDurationFields?: DurationFieldShowingState
  typeConfig?: DurationTypeJson,
}

const Model: DurationPickerConfigIF = {
  label:              'Duration',
  labelPosition:      'before',
  showDurationFields: null,
  typeConfig:         <DurationTypeJson>{
    _inputTypeKey: DurationType.TYPE_NAME,
    defaultValue:  0
  }
}

const demoConfig: DurationPickerConfigIF = Object.assign({}, Model)

export class DurationPickerConfig extends InputConfig
  implements Jsonified<DurationPickerConfig, DurationPickerConfigIF>, DurationPickerConfigIF {
  static override $model: DurationPickerConfigIF = ObjectUtil.assignDeep({}, InputConfig.$model, Model)

  static override INPUT_NAME = 'DurationPickerConfig'
  labelPosition: 'before' | 'after' | 'below' = 'before'
  override disabled: boolean
  showDurationFields?: DurationFieldShowingState
  override typeConfig: DurationType

  constructor(config?: DurationPickerConfigIF, key?: string) {
    super(DurationPickerConfig.INPUT_NAME, config || {}, key)
    this.typeConfig = new DurationType(this.typeConfig)
    if (!this.showDurationFields) {
      this.showDurationFields = {
        min: true,
        s:   true,
        ms:  true
      }
    }
  }

  getDemoInstance(): InputConfigJson {
    return new DurationPickerConfig(demoConfig)
  }

}

InputConfig.register(DurationPickerConfig)
