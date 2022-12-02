import {CommonModule} from '@angular/common'
import {NgModule} from '@angular/core'
import {FormsModule} from '@angular/forms'
import {MatButtonModule} from '@angular/material/button'
import {MatCheckboxModule} from '@angular/material/checkbox'
import {MatInputModule} from '@angular/material/input'
import {MatSlideToggleModule} from '@angular/material/slide-toggle'
import {MatSliderModule} from '@angular/material/slider'
import {TanjComponentsModule} from '@tangential/components'
import {TanjInputWidgetModule} from '@tangential/input-widgets'
//noinspection ES6PreferShortImport
import {ChooseInputWidgetDialog} from './support/choose-input-widget-dialog/choose-input-widget-dialog'
//noinspection ES6PreferShortImport
import {EditConfigurableWidgetComponent} from './support/edit-configurable-widget-component/edit-configurable-widget.component'
//noinspection ES6PreferShortImport
import {InputTemplateContainerComponent} from './support/template-components/input-template-component/input-template-container.component'
//noinspection ES6PreferShortImport
import {InputTemplateDirective} from './support/template-components/input-template-component/input-template.directive'
//noinspection ES6PreferShortImport
import {CheckboxWidgetTemplateComponent} from './widgets/checkbox/checkbox-widget.template.component'
//noinspection ES6PreferShortImport
import {DateTimeTemplateComponent} from './widgets/date-time-input/date-time-template.component'
//noinspection ES6PreferShortImport
import {DurationPickerTemplateComponent} from './widgets/duration-picker/duration-picker-template.component'
//noinspection ES6PreferShortImport
import {IconRatingWidgetTemplateComponent} from './widgets/icon-rating-widget/icon-rating-widget.template.component'
//noinspection ES6PreferShortImport
import {NumberTemplateComponent} from './widgets/number-input/number-template.component'
//noinspection ES6PreferShortImport
import {NumberSliderTemplateComponent} from './widgets/number-slider/number-slider-template.component'
//noinspection ES6PreferShortImport
import {NumberSpinnerTemplateComponent} from './widgets/number-spinner/number-spinner-template.component'
//noinspection ES6PreferShortImport
import {SlideToggleWidgetTemplateComponent} from './widgets/slide-toggle/slide-toggle-widget.template.component'
//noinspection ES6PreferShortImport
import {TextTemplateComponent} from './widgets/text-input/text-template.component'


@NgModule({
  imports:         [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatInputModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    MatSliderModule,

    TanjComponentsModule,
    TanjInputWidgetModule

  ],
  declarations:    [
    InputTemplateContainerComponent,
    InputTemplateDirective,
    EditConfigurableWidgetComponent,

    ChooseInputWidgetDialog,

    DateTimeTemplateComponent,
    DurationPickerTemplateComponent,
    IconRatingWidgetTemplateComponent,
    NumberTemplateComponent,
    NumberSliderTemplateComponent,
    NumberSpinnerTemplateComponent,
    TextTemplateComponent,
    CheckboxWidgetTemplateComponent,
    SlideToggleWidgetTemplateComponent,

  ],
  exports:         [
    InputTemplateContainerComponent,
    InputTemplateDirective,
    ChooseInputWidgetDialog,
    EditConfigurableWidgetComponent,

    DateTimeTemplateComponent,
    DurationPickerTemplateComponent,
    IconRatingWidgetTemplateComponent,
    NumberTemplateComponent,
    NumberSliderTemplateComponent,
    NumberSpinnerTemplateComponent,
    TextTemplateComponent,
    CheckboxWidgetTemplateComponent,
    SlideToggleWidgetTemplateComponent,
  ],
  entryComponents: [
    ChooseInputWidgetDialog,
    DateTimeTemplateComponent,
    IconRatingWidgetTemplateComponent,
    NumberTemplateComponent,
    NumberSliderTemplateComponent,
    NumberSpinnerTemplateComponent,
    TextTemplateComponent,
    DurationPickerTemplateComponent,
    CheckboxWidgetTemplateComponent,
    SlideToggleWidgetTemplateComponent
  ]
})
export class TanjConfigurableWidgetModule {

}
