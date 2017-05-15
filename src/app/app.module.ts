import {CommonModule} from '@angular/common';
import {Injectable, NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
// Base Angular2
import {BrowserModule, Title} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AdsenseModule, GoogleAnalytics} from '@tangential/analytics';

import {
  AuthenticationService,
  AuthSettingsService,
  FirebaseAuthenticationService,
  FirebaseAuthSettingsService,
  FirebaseUserService,
  FirebaseVisitorService,
  HasRoleGuard,
  UserService,
  VisitorResolver,
  VisitorService
} from '@tangential/authorization-service';
import {SignInPanelModule, TanjComponentsModule} from '@tangential/components';
import {InputRegistry} from '@tangential/configurable-widgets';
import {AppEnvironment, Logger, MessageBus} from '@tangential/core';
import {FirebaseConfig, FirebaseProvider} from '@tangential/firebase-util';
import {TanjInputWidgetModule} from '@tangential/input-widgets';
// Our Components
import {environment} from '../environments/environment';
import {AppComponent} from './app.component';
import {AppRoutingModule} from './app.routing.module';
// import { AdsenseModule } from "ng2-adsense";
import {AboutPage} from './features/casa/about/about.page';
import {ContactPage} from './features/casa/contact/contact.page';
import {HomePage} from './features/casa/home/home.page';
import {PrivacyPage} from './features/casa/privacy/privacy.page';
import {PasswordResetPage} from './features/casa/sign-in/password-reset.page';
import {SignInPage} from './features/casa/sign-in/sign-in.page';
import {SignOutPage} from './features/casa/sign-in/sign-out.page';
import {SignUpPage} from './features/casa/sign-in/sign-up.page';
import {TryoutWelcomePage} from './features/casa/tryout-welcome/tryout-welcome.page';
import {TanjCommonModule} from './features/common/common.module';
import {MainComponent} from './main/main.component';
import {TanjMaterialModule} from './tanj-material-module';


/**
 * Force eager loading of those background services that require eager loading.
 */
@Injectable()
export class EagerServiceLoader {

  constructor(private a: Logger) {
  }
}

const appEnvironment: AppEnvironment = <AppEnvironment>environment

if (!environment || !appEnvironment['firebaseConfig']) {
  console.error('Missing environment or appConfig.firebaseConfig', environment, appEnvironment)
}


@NgModule({
  imports: [

    SignInPanelModule,

    /* Ng2 Modules. */
    BrowserModule,
    CommonModule,
    FormsModule,
    BrowserAnimationsModule,


    /* Ng2MD modules */
    TanjMaterialModule,

    /* Other */
    AdsenseModule.forRoot({
      width: 320,
      height: 50,
      display: 'inline-block',
      adClient: 'ca-pub-0484786890985435',
      adSlot: 2655794844
    }),

    /* Tangential*/
    TanjComponentsModule,
    TanjInputWidgetModule,

    TanjCommonModule,


    /* Routing*/
    AppRoutingModule,

  ],
  declarations: [
    AppComponent,
    MainComponent,
    HomePage,
    AboutPage,
    ContactPage,
    PrivacyPage,

    SignInPage,
    SignUpPage,
    PasswordResetPage,
    SignOutPage,
    TryoutWelcomePage,
  ],
  providers: [
    {provide: AppEnvironment, useValue: appEnvironment},
    GoogleAnalytics,
    Title,
    MessageBus,
    Logger,
    EagerServiceLoader,
    VisitorResolver,
    FirebaseProvider,
    {provide: FirebaseConfig, useValue: appEnvironment.firebaseConfig},
    {provide: UserService, useClass: FirebaseUserService},
    {provide: AuthSettingsService, useClass: FirebaseAuthSettingsService},
    {provide: AuthenticationService, useClass: FirebaseAuthenticationService},

    HasRoleGuard,

    {provide: VisitorService, useClass: FirebaseVisitorService},
    {provide: InputRegistry, useClass: InputRegistry},
  ],
  entryComponents: [AppComponent],
  bootstrap: [AppComponent]
})
export class AppModule {


  constructor(bus: MessageBus, env: AppEnvironment, eagerLoadedServices: EagerServiceLoader) {
    Logger.info(bus, this, 'Application Loaded. Environment is: ', env)
  }
}
