import {NgModule} from '@angular/core'
import {
  Route,
  RouterModule
} from '@angular/router'
import {HasRoleGuard} from '@tangential/authorization-service'
import {VisitorResolver} from '@tangential/authorization-service'
import {AdminConsoleParentPage} from './pages/_parent/admin-console-parent.page'
//noinspection TypeScriptPreferShortImport
import {PermissionManagerPage} from './pages/permission-manager/permission-manager.page'
import {RoleManagerPage} from './pages/roles/role-manager.page'
import {UserManagerPage} from './pages/users/user-manager.page'
import {PluginsPage} from './pages/plugins/plugins.page'


export const AdminRoutes = {
  parent:   {
    path:        '',
    component:   AdminConsoleParentPage,
    resolve:     {visitor: VisitorResolver},
    canActivate: [HasRoleGuard],
    data:        {roles: ['Administrator']},
    navTargets:  {
      absSelf: ['/', 'admin'],
      up() {
        return ['/']
      },
    }
  },
  children: {
    plugins: {
      path:       'plugins',
      component:  PluginsPage,
      navTargets: {
        absSelf: ['/', 'admin', 'plugins']
      },
    },
    permissions: {
      path:       'permissions',
      component:  PermissionManagerPage,
      navTargets: {
        absSelf: ['/', 'admin', 'permissions']
      },
    },
    roles:       {
      path:       'roles',
      component:  RoleManagerPage,
      navTargets: {
        absSelf: ['/', 'admin', 'roles']
      },
    },
    users:       {
      path:       'users',
      component:  UserManagerPage,
      navTargets: {
        absSelf: ['/', 'admin', 'users']
      },
    }
  }
}

const routes: Route[] = [
  {
    path:        AdminRoutes.parent.path,
    component:   AdminRoutes.parent.component,
    canActivate: AdminRoutes.parent.canActivate,
    data:        AdminRoutes.parent.data,
    resolve:     AdminRoutes.parent.resolve,
    children:    [
      {
        path:     '',
        children: [
          AdminRoutes.children.plugins,
          AdminRoutes.children.permissions,
          AdminRoutes.children.roles,
          AdminRoutes.children.users,
        ]
      },

    ]
  }
];

@NgModule({
  imports:      [
    RouterModule.forChild(routes)
  ],
  exports:      [
    RouterModule
  ], providers: [
    VisitorResolver,
  ]
})
export class AdminConsoleRoutingModule {
}



