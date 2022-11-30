import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {GoogleAnalyticsFields} from '@tangential/analytics';
import {VisitorResolver} from '../../projects/tangential/authorization-service/src/lib';
import {PageInfo} from '@tangential/core';
import {AppRouteDefinitions} from './app.routes.definitions'
import {AboutPage} from './features/casa/about/about.page';
import {ContactPage} from './features/casa/contact/contact.page';
import {HomePage} from './features/casa/home/home.page'
import {PrivacyPage} from './features/casa/privacy/privacy.page';
import {PasswordResetPage} from './features/casa/sign-in/password-reset.page';
import {SignInPage} from './features/casa/sign-in/sign-in.page';
import {SignOutPage} from './features/casa/sign-in/sign-out.page';
import {SignUpPage} from './features/casa/sign-in/sign-up.page';
import {TryoutWelcomePage} from './features/casa/tryout-welcome/tryout-welcome.page';
import {PageNotFoundComponent} from './features/common/page-not-found/page-not-found.component';

export const AppRoutes = {

  signIn:        {
    path:       AppRouteDefinitions.signIn.path,
    component:  SignInPage,
    resolve:    {visitor: VisitorResolver},
    data:       {
      page:    <PageInfo>{
        title: 'Tangential: Sign in'
      },
      showAds: false
    },
    navTargets: AppRouteDefinitions.signIn.navTargets
  },
  signUp:        {
    path:       AppRouteDefinitions.signUp.path,
    component:  SignUpPage,
    resolve:    {visitor: VisitorResolver},
    data:       {
      page:    <PageInfo>{
        title: 'Tangential: Sign up'
      },
      showAds: false
    },
    navTargets: AppRouteDefinitions.signUp.navTargets
  },
  passwordReset: {
    path:       AppRouteDefinitions.passwordReset.path,
    component:  PasswordResetPage,
    resolve:    {visitor: VisitorResolver},
    data:       {
      page:    <PageInfo>{
        title: 'Tangential: Reset Password'
      },
      showAds: false
    },
    navTargets: AppRouteDefinitions.passwordReset.navTargets
  },
  signOut:       {
    path:       AppRouteDefinitions.signOut.path,
    component:  SignOutPage,
    resolve:    {visitor: VisitorResolver},
    data:       {
      page:    <PageInfo>{
        title: 'Tangential: Sign out'
      },
      showAds: false
    },
    navTargets: AppRouteDefinitions.signOut.navTargets
  },
  home:          {
    path:       AppRouteDefinitions.home.path,
    component:  HomePage,
    resolve:    {visitor: VisitorResolver},
    data:       {
      page:      <PageInfo>{
        title: 'Tangential: Fly home, buddy',
      },
      analytics: <GoogleAnalyticsFields> {
        page:          '/home',
        eventCategory: 'casa'
      }
    },
    navTargets: AppRouteDefinitions.home.navTargets
  },
  about:         {
    path:       AppRouteDefinitions.about.path,
    component:  AboutPage,
    data:       {
      page:      <PageInfo>{
        title: 'Tangential: About'
      },
      analytics: <GoogleAnalyticsFields> {
        page:          '/about',
        eventCategory: 'casa'
      }
    },
    navTargets: AppRouteDefinitions.about.navTargets
  },
  tryoutWelcome: {
    path:       AppRouteDefinitions.tryoutWelcome.path,
    component:  TryoutWelcomePage,
    data:       {
      page:      <PageInfo>{
        title: 'Tangential: Try it out'
      },
      analytics: <GoogleAnalyticsFields> {
        page:          '/tryout-welcome',
        eventCategory: 'casa'
      }
    },
    navTargets: AppRouteDefinitions.tryoutWelcome.navTargets
  },
  contact:       {
    path:       AppRouteDefinitions.contact.path,
    component:  ContactPage,
    data:       {
      page:      <PageInfo>{
        title: 'Tangential: Contact us'
      },
      analytics: <GoogleAnalyticsFields> {
        page:          '/contact',
        eventCategory: 'casa'
      }
    },
    navTargets: AppRouteDefinitions.contact.navTargets
  },
  privacy:       {
    path:       AppRouteDefinitions.privacy.path,
    component:  PrivacyPage,
    data:       {
      page:      <PageInfo>{
        title: 'Tangential: Our privacy policy'
      },
      analytics: <GoogleAnalyticsFields> {
        page:          '/privacy',
        eventCategory: 'casa'
      }
    },
    navTargets: AppRouteDefinitions.privacy.navTargets
  },
  _:             {
    path:       '',
    pathMatch:  "full" as "prefix" | "full", // hack because ????
    redirectTo: '/home'
  },
  wildcard:      {
    path:      '**',
    component: PageNotFoundComponent
  }
}

const appRoutesLocal: Routes = [
  {
    path:         'admin',
    loadChildren: () => import('./lazy-modules/ext-admin-console.module').then(x => x.ExtTanjAdminConsoleModule),
  },
  AppRoutes.signIn,
  AppRoutes.signUp,
  AppRoutes.passwordReset,
  AppRoutes.signOut,
  AppRoutes.home,
  AppRoutes.about,
  AppRoutes.contact,
  AppRoutes.privacy,
  AppRoutes.tryoutWelcome,
  AppRoutes._,
  AppRoutes.wildcard,
]

@NgModule({
  imports: [
    // RouterModule.forRoot(appRoutes, { errorHandler: NavErrorHandler })
    RouterModule.forRoot(appRoutesLocal)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {
}
