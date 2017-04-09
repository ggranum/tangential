import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {HttpModule} from "@angular/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {
  MaterialModule, MdButtonModule, MdCardModule, MdIconModule, MdListModule, MdMenuModule,
  MdToolbarModule
} from "@angular/material";

import {AppRoutingModule} from "./app-routing.module";
import {AppComponent} from "./app/app";

import {AsciidoctorPanelModule} from "@tangential/asciidoctor-panel";
import {InlineProfileModule} from "@tangential/inline-profile";
import {InlineLoginFormModule} from "@tangential/inline-login-form";
import {SignInPanelModule} from "@tangential/sign-in-panel";
import {AsciiDoctorPanelDemo} from "./pages/asciidoctor-panel/asciidoctor-panel-demo";
import {InlineProfileDemo} from "./pages/ux/inline-profile-demo";
import {
  FirebasePermissionService,
  FirebaseRoleService,
  FirebaseUserService,
  FirebaseVisitorService,
  PermissionService,
  RoleService,
  SignedInGuard,
  UserService,
  VisitorService
} from "@tangential/authorization-service";
import {FirebaseConfig, FirebaseProvider} from "@tangential/firebase-util";
// if the firebase-config.local file doesn't exist then you still need to run 'gulp firebase:init-project
// see the docs regarding preparing Firebase.
import {firebaseConfig} from "../lib/authorization-service/config/firebase-config.local";
import {SignInPageComponent} from "./app/pages/sign-in/sign-in-page.component";
import {HomeComponent} from "./app/pages/home/home.component";
import {AuthorizationServiceDemoModule} from "./pages/authorization-service/authorization-service-demo.module";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";


import "hammerjs";


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SignInPageComponent,
    AsciiDoctorPanelDemo,
    InlineProfileDemo,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    BrowserAnimationsModule,

    MdIconModule,
    MdToolbarModule,
    MdCardModule,
    MdListModule,
    MdMenuModule,


    ReactiveFormsModule,

    AppRoutingModule,

    AsciidoctorPanelModule,
    AuthorizationServiceDemoModule,
    InlineProfileModule,
    InlineLoginFormModule,
    SignInPanelModule,
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
  bootstrap: [AppComponent]
})
export class AppModule {

}
