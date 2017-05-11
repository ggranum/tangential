import {Jsonified, ObjectUtil} from '@tangential/core'
import {ConfigurableInputType, ConfigurableInputTypeJson} from '../configurable-input-type'
import {TextIval, TextIvalIF} from './text-ival'


export interface TextTypeIF extends ConfigurableInputTypeJson {
  maxLength?: number
  minLength?: number
  defaultValue?: string
}

/**
 * == Reporting
 * Text types can represent things like:
 *  * Quick notes, such as idea, or a Capture for 'I met a new person', and the persons name is the value.
 *  * Mood / Feeling
 *  * Name of a food eaten
 *  * Name of a place visited.
 *  * Name of a medication taken.
 *
 *
 * === Charts/Graphs
 * A text value is hard to plot in isolation. But consider the case of 'met a person'. In this case we could
 * plot time on the horizontal axis and number of people met per range. This would become a stacked bar chart?
 *
 * For something like mood, let's consider two cases:
 *   1) The capture is 'When' and 'Mood'. In this case we can have an arbitrary number of points in a day,
 *   and the user is probably going to want to correlate this value to time of day.
 *   - Go with a scatter plot, with days of the week on the X and hour of day on the Y, with the field as the point
 *     label.
 *   2) The capture is 'When', 'Feeling<text>', 'Weight<numeric>'.
 *
 */


const Model: TextTypeIF = {
  maxLength:    50,
  minLength:    0,
  defaultValue: null
}

export class TextType extends ConfigurableInputType implements Jsonified<TextType, TextTypeIF>, TextTypeIF {
  static $model: TextTypeIF = ObjectUtil.assignDeep({}, ConfigurableInputType.$model, Model)

  static TYPE_NAME = 'Text'
  maxLength: number
  minLength: number
  defaultValue: string

  constructor(config?: TextTypeIF) {
    super(config || {})
  }

  getInputTypeKey(): string {
    return TextType.TYPE_NAME
  }

  isNumeric(): boolean {
    return false
  }

  createValue(cfg?: TextIvalIF, key?: string): any {
    cfg = cfg || <any>{}
    return new TextIval({
      value: cfg.value || this.defaultValue
    }, key || this.$key);
  }

}

ConfigurableInputType.register(TextType)
