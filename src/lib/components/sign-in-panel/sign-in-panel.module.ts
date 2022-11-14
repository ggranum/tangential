import {CommonModule} from '@angular/common'
import {NgModule} from '@angular/core'
import {FormsModule} from '@angular/forms'
import {MatButtonModule} from '@angular/material/button'
import {MatCardModule} from '@angular/material/card'
import {MatCheckboxModule} from '@angular/material/checkbox'
import {MatIconModule} from '@angular/material/icon'
import {MatInputModule} from '@angular/material/input'
//noinspection ES6PreferShortImport
import {PasswordResetComponent} from './password-reset/password-reset.component'
//noinspection ES6PreferShortImport
import {SignInPanelComponent} from './sign-in-panel.component'
//noinspection ES6PreferShortImport
import {SignInPanelPage} from './sign-in-panel.page'
//noinspection ES6PreferShortImport
import {SignInComponent} from './sign-in/sign-in.component'
//noinspection ES6PreferShortImport
import {SignUpComponent} from './sign-up/sign-up.component'

@NgModule({
  imports:      [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatCardModule,
    MatIconModule,
    MatInputModule
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
