import {CommonModule} from '@angular/common'
import {NgModule} from '@angular/core'
import {FormsModule} from '@angular/forms'
import {MatCheckboxModule} from '@angular/material/checkbox'
import {MatInputModule} from '@angular/material/input'
import {MatSlideToggleModule} from '@angular/material/slide-toggle'
import {MatSliderModule} from '@angular/material/slider'
import {TanjComponentsModule} from '@tangential/components'
//noinspection ES6PreferShortImport
import {CheckboxWidgetConfigureComponent} from './checkbox-widget/checkbox-widget-configure.component'
//noinspection ES6PreferShortImport
import {CheckboxWidgetComponent} from './checkbox-widget/checkbox-widget.component'
//noinspection ES6PreferShortImport
import {DateTimeWidgetConfigureComponent} from './date-time-widget/date-time-widget-configure.component'
//noinspection ES6PreferShortImport
import {DateTimeWidgetComponent} from './date-time-widget/date-time-widget.component'
//noinspection ES6PreferShortImport
import {DurationPickerDialog} from './duration-picker-widget/duration-picker-dialog'
//noinspection ES6PreferShortImport
import {DurationPickerWidgetConfigureComponent} from './duration-picker-widget/duration-picker-widget-configure.component'
//noinspection ES6PreferShortImport
import {DurationPickerWidgetComponent} from './duration-picker-widget/duration-picker-widget.component'
//noinspection ES6PreferShortImport
import {IconRatingWidgetConfigureComponent} from './icon-rating-widget/icon-rating-widget-configure.component'
//noinspection ES6PreferShortImport
import {IconRatingWidgetComponent} from './icon-rating-widget/icon-rating-widget.component'
//noinspection ES6PreferShortImport
import {NumberSliderWidgetConfigureComponent} from './number-slider-widget/number-slider-widget-configure.component'
//noinspection ES6PreferShortImport
import {NumberSliderWidgetComponent} from './number-slider-widget/number-slider-widget.component'
//noinspection ES6PreferShortImport
import {NumberSpinnerWidgetConfigureComponent} from './number-spinner-widget/number-spinner-widget-configure.component'
//noinspection ES6PreferShortImport
import {NumberSpinnerWidgetComponent} from './number-spinner-widget/number-spinner-widget.component'
//noinspection ES6PreferShortImport
import {NumberWidgetConfigureComponent} from './number-widget/number-widget-configure.component'
//noinspection ES6PreferShortImport
import {NumberWidgetComponent} from './number-widget/number-widget.component'
//noinspection ES6PreferShortImport
import {SlideToggleWidgetConfigureComponent} from './slide-toggle-widget/slide-toggle-widget-configure.component'
//noinspection ES6PreferShortImport
import {SlideToggleWidgetComponent} from './slide-toggle-widget/slide-toggle-widget.component'
//noinspection ES6PreferShortImport
import {TextWidgetConfigureComponent} from './text-widget/text-widget-configure.component'
//noinspection ES6PreferShortImport
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
