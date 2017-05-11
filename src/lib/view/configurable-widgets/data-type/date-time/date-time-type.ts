import {Jsonified, ObjectUtil} from '@tangential/core'


import * as moment from 'moment'
import {ConfigurableInputType, ConfigurableInputTypeJson} from '../configurable-input-type'
import {DateTimeIval, DateTimeIvalIF} from './date-time-ival'

const BROWSER_DATE_TIME_LOCAL_FORMAT = 'YYYY-MM-DDTHH:mm:ss'

export interface DateTimeTypeIF extends ConfigurableInputTypeJson {
  afterMils?: number
  beforeMils?: number
  defaultValue?: number
  defaultToNow?: boolean
}

const Model: DateTimeTypeIF = {
  afterMils:    null,
  beforeMils:   null,
  defaultValue: null,
  defaultToNow: true
}

export class DateTimeType extends ConfigurableInputType implements Jsonified<DateTimeType, DateTimeTypeIF>, DateTimeTypeIF {
  static $model: DateTimeTypeIF = ObjectUtil.assignDeep({}, ConfigurableInputType.$model, Model)
  static TYPE_NAME = 'DateTime'
  afterMils?: number
  beforeMils?: number
  defaultValue?: number
  defaultToNow?: boolean

  constructor(config?: DateTimeTypeIF, key?: string) {
    super(config || {}, key)
  }

  getInputTypeKey(): string {
    return DateTimeType.TYPE_NAME
  }

  get uiValue(): string {
    return moment(this.defaultValue).format(BROWSER_DATE_TIME_LOCAL_FORMAT)
  }

  set uiValue(val: string) {
    this.defaultValue = moment(val, BROWSER_DATE_TIME_LOCAL_FORMAT).valueOf()
  }

  isNumeric(): boolean {
    return false
  }

  createValue(cfg?: DateTimeIvalIF, key?: string): DateTimeIval {
    cfg = cfg || <any>{}
    return new DateTimeIval({
      value:              cfg.value || this.getDefaultValue(),
      recordedInTimeZone: cfg.recordedInTimeZone || 'GMT'
    }, key || this.$key);
  }

  getDefaultValue(): number {
    return this.defaultToNow ? Date.now() : this.defaultValue
  }


}

ConfigurableInputType.register(DateTimeType)
