import {NgModule} from '@angular/core'
import {CommonModule} from '@angular/common'
import {FormsModule} from '@angular/forms'



//noinspection TypeScriptPreferShortImport
import {SignInPanelComponent} from './sign-in-panel.component'
//noinspection TypeScriptPreferShortImport
import {SignInPanelDemo} from "./sign-in-panel.demo";
import {SignInPanelPage} from "./sign-in-panel.page";
import {MdButtonModule, MdCheckboxModule, MdCardModule, MdIconModule, MdInputModule} from "@angular/material";
import {FlexLayoutModule} from "@angular/flex-layout";

@NgModule({
  declarations: [
    SignInPanelDemo,
    SignInPanelPage,
    SignInPanelComponent,
  ],
  imports: [
    FlexLayoutModule,
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
