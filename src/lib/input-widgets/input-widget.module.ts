import {CommonModule} from '@angular/common'
import {NgModule} from '@angular/core'
import {FormsModule} from '@angular/forms'
import {MatCheckboxModule, MatInputModule, MatSliderModule, MatSlideToggleModule} from '@angular/material'
import {TanjComponentsModule} from '@tangential/components'
//noinspection TypeScriptPreferShortImport
import {CheckboxWidgetConfigureComponent} from './checkbox-widget/checkbox-widget-configure.component'
//noinspection TypeScriptPreferShortImport
import {CheckboxWidgetComponent} from './checkbox-widget/checkbox-widget.component'
import {DateTimeWidgetConfigureComponent} from './date-time-widget/date-time-widget-configure.component'
import {DateTimeWidgetComponent} from './date-time-widget/date-time-widget.component'
//noinspection TypeScriptPreferShortImport
import {DurationPickerDialog} from './duration-picker-widget/duration-picker-dialog'
//noinspection TypeScriptPreferShortImport
import {DurationPickerWidgetConfigureComponent} from './duration-picker-widget/duration-picker-widget-configure.component'
//noinspection TypeScriptPreferShortImport
import {DurationPickerWidgetComponent} from './duration-picker-widget/duration-picker-widget.component'
//noinspection TypeScriptPreferShortImport
import {IconRatingWidgetConfigureComponent} from './icon-rating-widget/icon-rating-widget-configure.component'
//noinspection TypeScriptPreferShortImport
import {IconRatingWidgetComponent} from './icon-rating-widget/icon-rating-widget.component'
//noinspection TypeScriptPreferShortImport
import {NumberSliderWidgetConfigureComponent} from './number-slider-widget/number-slider-widget-configure.component'
//noinspection TypeScriptPreferShortImport
import {NumberSliderWidgetComponent} from './number-slider-widget/number-slider-widget.component'
//noinspection TypeScriptPreferShortImport
import {NumberSpinnerWidgetConfigureComponent} from './number-spinner-widget/number-spinner-widget-configure.component'
//noinspection TypeScriptPreferShortImport
import {NumberSpinnerWidgetComponent} from './number-spinner-widget/number-spinner-widget.component'
//noinspection TypeScriptPreferShortImport
import {NumberWidgetConfigureComponent} from './number-widget/number-widget-configure.component'
//noinspection TypeScriptPreferShortImport
import {NumberWidgetComponent} from './number-widget/number-widget.component'
//noinspection TypeScriptPreferShortImport
import {SlideToggleWidgetConfigureComponent} from './slide-toggle-widget/slide-toggle-widget-configure.component'
//noinspection TypeScriptPreferShortImport
import {SlideToggleWidgetComponent} from './slide-toggle-widget/slide-toggle-widget.component'
//noinspection TypeScriptPreferShortImport
import {TextWidgetConfigureComponent} from './text-widget/text-widget-configure.component'
//noinspection TypeScriptPreferShortImport
import {TextWidgetComponent} from './text-widget/text-widget.component'

@NgModule({
  imports:         [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    MatSliderModule,

    TanjComponentsModule
  ],
  declarations:    [

    CheckboxWidgetComponent,
    CheckboxWidgetConfigureComponent,

    DateTimeWidgetComponent,
    DateTimeWidgetConfigureComponent,

    DurationPickerDialog,
    DurationPickerWidgetComponent,
    DurationPickerWidgetConfigureComponent,

    IconRatingWidgetComponent,
    IconRatingWidgetConfigureComponent,

    NumberWidgetComponent,
    NumberWidgetConfigureComponent,

    NumberSliderWidgetComponent,
    NumberSliderWidgetConfigureComponent,

    NumberSpinnerWidgetComponent,
    NumberSpinnerWidgetConfigureComponent,

    SlideToggleWidgetComponent,
    SlideToggleWidgetConfigureComponent,

    TextWidgetComponent,
    TextWidgetConfigureComponent,

  ],
  exports:         [
    CheckboxWidgetComponent,
    CheckboxWidgetConfigureComponent,

    DateTimeWidgetComponent,
    DateTimeWidgetConfigureComponent,

    DurationPickerDialog,
    DurationPickerWidgetComponent,
    DurationPickerWidgetConfigureComponent,

    IconRatingWidgetComponent,
    IconRatingWidgetConfigureComponent,

    NumberSliderWidgetComponent,
    NumberSliderWidgetConfigureComponent,

    NumberSpinnerWidgetComponent,
    NumberSpinnerWidgetConfigureComponent,

    NumberWidgetComponent,
    NumberWidgetConfigureComponent,

    SlideToggleWidgetComponent,
    SlideToggleWidgetConfigureComponent,

    TextWidgetComponent,
    TextWidgetConfigureComponent,

  ],
  entryComponents: [
    DurationPickerDialog,
  ]
})
export class TanjInputWidgetModule {

}
