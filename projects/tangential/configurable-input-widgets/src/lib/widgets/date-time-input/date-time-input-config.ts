import {
  Jsonified,
  ObjectUtil
} from '@tangential/core'
import * as moment from 'moment'
//noinspection ES6PreferShortImport
import {
  DateTimeType,
  DateTimeTypeIF
} from '../../data-type/date-time/date-time-type'
//noinspection ES6PreferShortImport
import {NumberType} from '../../data-type/number/number-type'
import {
  InputConfig,
  InputConfigJson
} from '../../input-config'


export interface DateTimeInputConfigIF extends InputConfigJson {
  labelPosition?: 'before' | 'after'
  disabled?: boolean
  format?: string
  typeConfig?: DateTimeTypeIF
}

const Model: DateTimeInputConfigIF = {
  label:         'Date & Time',
  labelPosition: 'before',
  disabled:      false,
  format:        'YYYY-MM-dd HH:mm:ss',

  typeConfig: <DateTimeTypeIF>{
    _inputTypeKey: NumberType.TYPE_NAME,
    defaultToNow:  true,
    beforeMils:    null,
    afterMils:     null,
    defaultValue:  moment().startOf('hour').valueOf()
  }
}


const demoConfig: DateTimeInputConfigIF = Object.assign({}, Model)
console.log('Loading DateTimeInputConfig', '')
export class DateTimeInputConfig extends InputConfig
  implements Jsonified<DateTimeInputConfig, DateTimeInputConfigIF>, DateTimeInputConfigIF {
  static override $model: DateTimeInputConfigIF = ObjectUtil.assignDeep({}, InputConfig.$model, Model)

  static override INPUT_NAME = 'DateTimeInput'
  labelPosition: 'before' | 'after'
  override disabled: boolean
  override typeConfig: DateTimeType


  constructor(config?: DateTimeInputConfigIF, key?: string) {
    super(DateTimeInputConfig.INPUT_NAME, config || {}, key)
    this.typeConfig = new DateTimeType(this.typeConfig)
  }

  getDemoInstance(): InputConfigJson {
    return new DateTimeInputConfig(demoConfig)
  }


}

InputConfig.register(DateTimeInputConfig)
