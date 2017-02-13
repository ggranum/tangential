import {NgModule} from '@angular/core'


import {CommonModule} from '@angular/common'
import {FormsModule} from '@angular/forms'

import {MdButtonModule} from '@angular/material/button/button'
import {MdIconModule} from '@angular/material/icon/icon'
import {MdInputModule} from '@angular/material/input'


import {InlineLoginFormComponent} from './inline-login-form.component'


@NgModule({
  declarations: [
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
    InlineLoginFormComponent
  ]
})
export class InlineLoginFormModule {

}
