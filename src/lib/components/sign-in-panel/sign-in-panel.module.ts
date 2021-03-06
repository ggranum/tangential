import {CommonModule} from '@angular/common'
import {NgModule} from '@angular/core'
import {FormsModule} from '@angular/forms'
import {MdButtonModule, MdCardModule, MdCheckboxModule, MdIconModule, MdInputModule} from '@angular/material'
//noinspection TypeScriptPreferShortImport
import {PasswordResetComponent} from './password-reset/password-reset.component'
//noinspection TypeScriptPreferShortImport
import {SignInPanelComponent} from './sign-in-panel.component'
//noinspection TypeScriptPreferShortImport
import {SignInPanelPage} from './sign-in-panel.page'
//noinspection TypeScriptPreferShortImport
import {SignInComponent} from './sign-in/sign-in.component'
//noinspection TypeScriptPreferShortImport
import {SignUpComponent} from './sign-up/sign-up.component'

@NgModule({
  imports:      [
    CommonModule,
    FormsModule,
    MdButtonModule,
    MdCheckboxModule,
    MdCardModule,
    MdIconModule,
    MdInputModule
  ],
  declarations: [
    SignInPanelPage,
    SignInPanelComponent,
    SignInComponent,
    SignUpComponent,
    PasswordResetComponent,

  ],
  exports:      [
    SignInPanelComponent,
    SignInPanelPage,
    SignInComponent,
    SignUpComponent,
    PasswordResetComponent,
  ]
})
export class SignInPanelModule {

}
