import {NgModule} from '@angular/core'
import {CommonModule} from '@angular/common'
import {FormsModule} from '@angular/forms'

import {MdButtonModule, MdCheckboxModule, MdIconModule, MdInputModule, MdCardModule} from '@angular/material'


//noinspection TypeScriptPreferShortImport
import {SignInPanelComponent} from './sign-in-panel.component'
//noinspection TypeScriptPreferShortImport
import {SignInPanelDemo} from "./sign-in-panel.demo";
import {SignInPanelPage} from "./sign-in-panel.page";

@NgModule({
  declarations: [
    SignInPanelDemo,
    SignInPanelPage,
    SignInPanelComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    MdButtonModule,
    MdCheckboxModule,
    MdCardModule,
    MdIconModule,
    MdInputModule
  ],
  exports: [
    SignInPanelComponent,
    SignInPanelPage
  ]
})
export class SignInPanelModule {

}
