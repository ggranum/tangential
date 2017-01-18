import {NgModule, ApplicationRef} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {HttpModule} from "@angular/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";
import {MaterialModule} from "@angular/material";

import {DEMO_APP_ROUTES} from "./demo-app/routes";
import {DemoApp, Home} from "./demo-app/demo-app";
import {ButtonDemo} from "./button/button-demo";
import {InlineProfileComponent} from "../lib/ux/inline-profile/inline-profile.component";
import {AuthorizationServiceDemoModule } from "./authorization-service/authorization-service-demo";
import {AsciiDoctorPanelDemo} from "./asciidoctor-panel/asciidoctor-panel-demo";
import {InlineProfileDemo} from "./ux/inline-profile-demo";
import {RvAsciidoctorPanelModule} from "@tangential/asciidoctor-panel";

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule,
    RouterModule.forRoot(DEMO_APP_ROUTES),
    MaterialModule.forRoot(),
    RvAsciidoctorPanelModule.forRoot(),
    AuthorizationServiceDemoModule,
  ],
  declarations: [
    ButtonDemo,
    AsciiDoctorPanelDemo,
    InlineProfileComponent,
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
    this._appRef.bootstrap(DemoApp);
  }
}
