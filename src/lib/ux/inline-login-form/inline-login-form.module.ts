import {NgModule} from "@angular/core";


import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";

import {MdButtonModule, MdIconModule, MdInputModule} from "@angular/material";


import {InlineLoginFormComponent} from "./inline-login-form.component";


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
