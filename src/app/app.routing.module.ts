import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {GoogleAnalyticsFields} from '@tangential/analytics';
import {AboutPage} from './features/casa/about/about.page';
import {ContactPage} from './features/casa/contact/contact.page';
import {HomePage} from './features/casa/home/home.page';
import {PrivacyPage} from './features/casa/privacy/privacy.page';
import {PasswordResetPage} from './features/casa/sign-in/password-reset.page';
import {SignInPage} from './features/casa/sign-in/sign-in.page';
import {SignOutPage} from './features/casa/sign-in/sign-out.page';
import {SignUpPage} from './features/casa/sign-in/sign-up.page';
import {TryoutWelcomePage} from './features/casa/tryout-welcome/tryout-welcome.page';
import {PageNotFoundComponent} from './features/common/page-not-found/page-not-found.component';
import {VisitorResolver} from '@tangential/authorization-service';
import {PageInfo} from '@tangential/core';


export const AppRoutes = {

  signIn:        {
    path:       'sign-in',
    component:  SignInPage,
    resolve:    {visitor: VisitorResolver},
    data:       {
      page:     <PageInfo>{
        title: 'Tangential: Sign in'
      },
      showAds: false
    },
    navTargets: {
      absSelf: ['/', 'sign-in'],
      absToSignUp() {
        return AppRoutes.signUp.navTargets.absSelf
      },
      absToPasswordReset() {
        return AppRoutes.passwordReset.navTargets.absSelf
      }
    }
  },
  signUp:        {
    path:       'sign-up',
    component:  SignUpPage,
    resolve:    {visitor: VisitorResolver},
    data:       {
      page:     <PageInfo>{
        title: 'Tangential: Sign up'
      },
      showAds: false
    },
    navTargets: {
      absSelf: ['/', 'sign-up'],
      absToSignIn() {
        return AppRoutes.signIn.navTargets.absSelf
      },
    }
  },
  passwordReset: {
    path:       'password-reset',
    component:  PasswordResetPage,
    resolve:    {visitor: VisitorResolver},
    data:       {
      page:     <PageInfo>{
        title: 'Tangential: Reset Password'
      },
      showAds: false
    },
    navTargets: {
      absSelf: ['/', 'password-reset'],
      absToSignIn() {
        return AppRoutes.signIn.navTargets.absSelf
      },
    }
  },
  signOut:       {
    path:       'sign-out',
    component:  SignOutPage,
    resolve:    {visitor: VisitorResolver},
    data:       {
      page:     <PageInfo>{
        title: 'Tangential: Sign out'
      },
      showAds: false
    },
    navTargets: {
      absSelf: ['/', 'sign-out']
    }
  },
  home:          {
    path:      'home',
    component: HomePage,
    resolve:   {visitor: VisitorResolver},
    data:      {
      page:     <PageInfo>{
        title:       'Tangential: Fly home, buddy',
      },
      analytics: <GoogleAnalyticsFields> {
        page:          '/home',
        eventCategory: 'casa'
      }
    },
    navTargets: {
      absSelf: ['/', 'home'],
      absSignIn() {
        return AppRoutes.signIn.navTargets.absSelf
      },
      absSignUp() {
        return AppRoutes.signUp.navTargets.absSelf
      },
      absSignOut() {
        return AppRoutes.signOut.navTargets.absSelf
      },
      absTryoutWelcome() {
        return AppRoutes.tryoutWelcome.navTargets.absSelf
      }
    }
  },
  about:         {
    path:       'about',
    component:  AboutPage,
    data:       {
      page:     <PageInfo>{
        title: 'Tangential: About'
      },
      analytics: <GoogleAnalyticsFields> {
        page:          '/about',
        eventCategory: 'casa'
      }
    },
    navTargets: {
      absSelf: ['/', 'about']

    }
  },
  tryoutWelcome: {
    path:       'tryout-welcome',
    component:  TryoutWelcomePage,
    data:       {
      page:     <PageInfo>{
        title: 'Tangential: Try it out'
      },
      analytics: <GoogleAnalyticsFields> {
        page:          '/tryout-welcome',
        eventCategory: 'casa'
      }
    },
    navTargets: {
      absSelf: ['/', 'tryout-welcome'],
      absToContactPage() {
        return AppRoutes.contact.navTargets.absSelf
      },
    }
  },
  contact:       {
    path:       'contact',
    component:  ContactPage,
    data:       {
      page:     <PageInfo>{
        title: 'Tangential: Contact us'
      },
      analytics: <GoogleAnalyticsFields> {
        page:          '/contact',
        eventCategory: 'casa'
      }
    },
    navTargets: {
      absSelf: ['/', 'contact']

    }
  },
  privacy:       {
    path:       'privacy',
    component:  PrivacyPage,
    data:       {
      page:     <PageInfo>{
        title: 'Tangential: Our privacy policy'
      },
      analytics: <GoogleAnalyticsFields> {
        page:          '/privacy',
        eventCategory: 'casa'
      }
    },
    navTargets: {
      absSelf: ['/', 'privacy']
    }
  },
  _:             {
    path: '', redirectTo: '/home', pathMatch: 'full'
  },
  wildcard:      {path: '**', component: PageNotFoundComponent}
}

const appRoutesLocal: Routes = [
  {
    path: 'admin',
    loadChildren: './lazy-modules/ext-admin-console.module#ExtTanjAdminConsoleModule',
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
