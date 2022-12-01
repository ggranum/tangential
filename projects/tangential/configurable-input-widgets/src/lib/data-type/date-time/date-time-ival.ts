import {Jsonified, ObjectUtil} from '@tangential/core'

import moment from 'moment'
import {ConfigurableInputIval, ConfigurableInputIvalJson} from '../configurable-input-ival'

const BROWSER_DATE_TIME_LOCAL_FORMAT = 'YYYY-MM-DDTHH:mm'

export interface DateTimeIvalIF extends ConfigurableInputIvalJson {
  value?: number
  recordedInTimeZone?: string
}

const Model: DateTimeIvalIF = {
  value:              0,
  recordedInTimeZone: 'GMT'
}

export class DateTimeIval extends ConfigurableInputIval implements Jsonified<DateTimeIval, DateTimeIvalIF>, DateTimeIvalIF {
  static override $model: DateTimeIvalIF = ObjectUtil.assignDeep({}, ConfigurableInputIval.$model, Model)


  override value: number
  recordedInTimeZone: string

  constructor(config?: DateTimeIvalIF, key?: string) {
    super(config, key)
    this.value = config.value || 0
  }

  override get uiValue(): string {
    return moment(this.value).format(BROWSER_DATE_TIME_LOCAL_FORMAT)
  }

  override set uiValue(val: string) {
    this.value = moment(val, BROWSER_DATE_TIME_LOCAL_FORMAT).valueOf()
  }

}
