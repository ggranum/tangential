import {NgModule, ApplicationRef} from "@angular/core"
import {BrowserModule} from "@angular/platform-browser"
import {HttpModule} from "@angular/http"
import {FormsModule, ReactiveFormsModule} from "@angular/forms"
import {RouterModule} from "@angular/router"
import {MaterialModule} from "@angular/material"

import {DEMO_APP_ROUTES} from "./demo-app/routes"
import {DemoApp, Home} from "./demo-app/demo-app"
import {ButtonDemo} from "./button/button-demo"

import {AuthorizationServiceDemoModule } from "./authorization-service/authorization-service-demo"
import {InlineProfileModule} from "@tangential/inline-profile"
import {InlineLoginFormModule} from "@tangential/inline-login-form"
import {RvAsciidoctorPanelModule} from "@tangential/asciidoctor-panel"




import {AsciiDoctorPanelDemo} from "./asciidoctor-panel/asciidoctor-panel-demo"
import {InlineProfileDemo} from "./ux/inline-profile-demo"

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule,
    InlineLoginFormModule,
    InlineProfileModule,
    RouterModule.forRoot(DEMO_APP_ROUTES),
    MaterialModule.forRoot(),
    RvAsciidoctorPanelModule.forRoot(),
    AuthorizationServiceDemoModule
  ],
  declarations: [
    ButtonDemo,
    AsciiDoctorPanelDemo,
    InlineProfileDemo,
    DemoApp,
    Home,
  ],
  entryComponents: [
    DemoApp,
  ],
})
export class DemoAppModule {
  constructor(private _appRef: ApplicationRef) { }

  ngDoBootstrap() {
    this._appRef.bootstrap(DemoApp)
  }
}
