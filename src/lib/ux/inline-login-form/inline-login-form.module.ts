import {NgModule} from '@angular/core'


import {CommonModule} from '@angular/common'
import {FormsModule} from '@angular/forms'

import {MdButtonModule} from '@angular/material/button/button'
import {MdIconModule} from '@angular/material/icon/icon'
import {MdInputModule} from '@angular/material/input/input'


import {InlineLoginFormContainer} from './inline-login-form.container'
import {InlineLoginFormComponent} from './inline-login-form.component'


@NgModule({
  declarations: [
    InlineLoginFormContainer,
    InlineLoginFormComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MdButtonModule,

    MdIconModule,
    MdInputModule
  ],
  exports: [
    InlineLoginFormContainer
  ]
})
export class InlineLoginFormModule {

}
