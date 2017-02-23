import {NgModule, ApplicationRef, Injectable} from "@angular/core"
import {BrowserModule} from "@angular/platform-browser"
import {HttpModule} from "@angular/http"
import {FormsModule, ReactiveFormsModule} from "@angular/forms"
import {MaterialModule} from "@angular/material"

import {DEMO_APP_ROUTES} from "./demo-app/routes"
import {DemoApp} from "./demo-app/demo-app"

import {AsciidoctorPanelModule} from "@tangential/asciidoctor-panel"
import {InlineProfileModule} from "@tangential/inline-profile"
import {InlineLoginFormModule} from "@tangential/inline-login-form"
import {SignInPanelModule} from "@tangential/sign-in-panel";
import {AsciiDoctorPanelDemo} from "./demo-pages/asciidoctor-panel/asciidoctor-panel-demo";
import {InlineProfileDemo} from "./demo-pages/ux/inline-profile-demo";
import {RouterModule} from "@angular/router";
import {SignedInGuard, FirebasePermissionService, PermissionService} from "@tangential/authorization-service";
import {FirebaseProvider, FirebaseConfig} from "@tangential/firebase-util";
import {
  FirebaseUserService,
  UserService,
  FirebaseRoleService,
  RoleService,
  FirebaseVisitorService, VisitorService
} from "@tangential/authorization-service";

// if the firebase-config.local file doesn't exist then you still need to run 'gulp firebase:init-project
// see the docs regarding preparing Firebase.
import {firebaseConfig} from "../lib/authorization-service/config/firebase-config.local";
import {SignInPageComponent} from "./demo-app/pages/sign-in/sign-in-page.component";
import {HomeComponent} from "./demo-app/pages/home/home.component";
import {AuthorizationServiceDemoModule} from "./demo-pages/authorization-service/authorization-service-demo.module";


@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    MaterialModule.forRoot(),
    ReactiveFormsModule,
    RouterModule.forRoot(DEMO_APP_ROUTES),
    AsciidoctorPanelModule,
    AuthorizationServiceDemoModule,
    InlineProfileModule,
    InlineLoginFormModule,
    SignInPanelModule,
  ],
  declarations: [
    SignInPageComponent,
    AsciiDoctorPanelDemo,
    InlineProfileDemo,
    DemoApp,
    HomeComponent,
  ],
  providers: [
    {provide: FirebaseConfig, useValue: firebaseConfig},
    FirebaseProvider,
    {provide: PermissionService, useClass: FirebasePermissionService},
    {provide: RoleService, useClass: FirebaseRoleService},
    {provide: UserService, useClass: FirebaseUserService},
    {provide: VisitorService, useClass: FirebaseVisitorService},
    SignedInGuard
  ],
  entryComponents: [
    DemoApp,
  ],
})
export class DemoAppModule {
  constructor(private _appRef: ApplicationRef, private vs:VisitorService) {
    console.log('DemoAppModule', 'constructor', vs.isVisitorSignedIn())
  }

  ngDoBootstrap() {
    this._appRef.bootstrap(DemoApp)
  }
}
