import {ObjectUtil} from '@tangential/core'
//noinspection TypeScriptPreferShortImport
import {NumberType, NumberTypeIF} from '../../data-type/number/number-type'
import {InputConfig, InputConfigJson} from '../../input-config'


export interface IconRatingWidgetConfigIF extends InputConfigJson {
  labelPosition?: 'before' | 'after' | 'below'
  disabled?: boolean
  typeConfig?: NumberTypeIF
  iconCount?: number
  iconFont?: string
  offIconNames?: string[]
  onIconNames?: string[]
}
const defaultIconCount = 5
const Model: IconRatingWidgetConfigIF = {
  label:         'Rating',
  labelPosition: 'below',
  iconFont:      'material-icons',
  offIconNames:  [
    'star_border'
  ],
  onIconNames:   [
    'star'
  ],
  disabled:      false,
  typeConfig:    <NumberTypeIF>{
    _inputTypeKey: NumberType.TYPE_NAME,
    defaultValue:  defaultIconCount - 1,
    min:           0,
    max:           defaultIconCount,
    step:          1,
    decimalPlaces: 0,
  }
}

const demoConfig: IconRatingWidgetConfigIF = Object.assign({}, Model)

export class IconRatingWidgetConfig extends InputConfig implements IconRatingWidgetConfigIF {
  static $model: IconRatingWidgetConfigIF = ObjectUtil.assignDeep({}, InputConfig.$model, Model)
  static INPUT_NAME = 'IconRatingWidget'
  labelPosition: 'before' | 'after' | 'below'
  disabled: boolean
  typeConfig: NumberType
  iconCount?: number
  iconFont?: string
  offIconNames?: string[]
  onIconNames?: string[]

  constructor(config?: IconRatingWidgetConfigIF, key?: string) {
    super(IconRatingWidgetConfig.INPUT_NAME, config || {}, key)
    this.typeConfig = new NumberType(this.typeConfig)
    if (this.typeConfig.max > 10) {
      this.typeConfig.max = 10
    }
  }

  getDemoInstance(): InputConfigJson {
    return new IconRatingWidgetConfig(demoConfig)
  }

}

InputConfig.register(IconRatingWidgetConfig)
