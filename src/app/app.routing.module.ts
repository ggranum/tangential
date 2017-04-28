import {NgModule} from '@angular/core'
import {RouterModule, Routes} from '@angular/router'
import {GoogleAnalyticsFields} from '@tangential/analytics'
import {AboutComponent} from './features/casa/about/about.component'
import {ContactComponent} from './features/casa/contact/contact.component'
import {HomePage} from './features/casa/home/home.page'
import {PrivacyComponent} from './features/casa/privacy/privacy.component'
import {PasswordResetPage} from './features/casa/sign-in/password-reset.page'
import {SignInPage} from './features/casa/sign-in/sign-in.page'
import {SignOutPage} from './features/casa/sign-in/sign-out.page'
import {SignUpPage} from './features/casa/sign-in/sign-up.page'
import {TryoutWelcomePage} from './features/casa/tryout-welcome/tryout-welcome.page'
import {PageNotFoundComponent} from './features/common/page-not-found/page-not-found.component'
import {VisitorResolver} from '@tangential/visitor-service'


export const AppRoutes = {

  signIn:        {
    path:       'sign-in',
    component:  SignInPage,
    resolve:    {visitor: VisitorResolver},
    data:       {
      seo:     {
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
      seo:     {
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
      seo:     {
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
      seo:     {
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
      seo:       {
        title:       'Tangential: Fly home, buddy',
        description: ``
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
    component:  AboutComponent,
    data:       {
      seo:       {
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
      seo:       {
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
    component:  ContactComponent,
    data:       {
      seo:       {
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
    component:  PrivacyComponent,
    data:       {
      seo:       {
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
    loadChildren: 'lib/view/modules/admin-console/admin-console.module#TanjAdminConsoleModule',
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
