export interface TangentialNavigation {
  navTargets: any
  path: any
}

interface RouteDefinitions {
  about: TangentialNavigation;
  contact: TangentialNavigation;
  home: TangentialNavigation;
  passwordReset: TangentialNavigation;
  privacy: TangentialNavigation;
  signIn: TangentialNavigation;
  signOut: TangentialNavigation;
  signUp: TangentialNavigation;
  tryoutWelcome: TangentialNavigation;

}

export const AppRouteDefinitions: RouteDefinitions = {

  signIn:        {
    path:       'sign-in',
    navTargets: {
      absSelf: ['/', 'sign-in'],
      absToSignUp() {
        return AppRouteDefinitions.signUp.navTargets.absSelf
      },
      absToPasswordReset() {
        return AppRouteDefinitions.passwordReset.navTargets.absSelf
      }
    }
  },
  signUp:        {
    path:       'sign-up',
    navTargets: {
      absSelf: ['/', 'sign-up'],
      absToSignIn() {
        return AppRouteDefinitions.signIn.navTargets.absSelf
      },
    }
  },
  passwordReset: {
    path:       'password-reset',
    navTargets: {
      absSelf: ['/', 'password-reset'],
      absToSignIn() {
        return AppRouteDefinitions.signIn.navTargets.absSelf
      },
    }
  },
  signOut:       {
    path:       'sign-out',
    navTargets: {
      absSelf: ['/', 'sign-out']
    }
  },
  home:          {
    path:       'home',
    navTargets: {
      absSelf: ['/', 'home'],
      absSignIn() {
        return AppRouteDefinitions.signIn.navTargets.absSelf
      },
      absSignUp() {
        return AppRouteDefinitions.signUp.navTargets.absSelf
      },
      absSignOut() {
        return AppRouteDefinitions.signOut.navTargets.absSelf
      },
      absTryoutWelcome() {
        return AppRouteDefinitions.tryoutWelcome.navTargets.absSelf
      }
    }
  },
  about:         {
    path:       'about',
    navTargets: {
      absSelf: ['/', 'about']

    }
  },
  tryoutWelcome: {
    path:       'tryout-welcome',
    navTargets: {
      absSelf: ['/', 'tryout-welcome'],
      absToContactPage() {
        return AppRouteDefinitions.contact.navTargets.absSelf
      },
    }
  },
  contact:       {
    path:       'contact',
    navTargets: {
      absSelf: ['/', 'contact']
    }
  },
  privacy:       {
    path:       'privacy',
    navTargets: {
      absSelf: ['/', 'privacy']
    }
  },
}
