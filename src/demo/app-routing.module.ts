import {RouterModule, Routes} from "@angular/router";
import {HomeComponent} from "./app/pages/home/home.component";
import {AsciiDoctorPanelDemo} from "./pages/asciidoctor-panel/asciidoctor-panel-demo";
import {InlineProfileDemo} from "./pages/ux/inline-profile-demo";
import {AdminPage} from "@tangential/admin-ui";
import {SignInPanelDemo} from "@tangential/sign-in-panel";
import {SignedInGuard} from "@tangential/authorization-service";
import {SignInPageComponent} from "./app/pages/sign-in/sign-in-page.component";
import {AuthorizationServiceDemoContainer} from "./pages/authorization-service/authorization-service-demo.container";
import {NgModule} from "@angular/core";


export const
  appRoutes: Routes = [
  {path: '', component: HomeComponent},
  {
    path: 'admin-demo',
    component: AdminPage,
    canActivate: [SignedInGuard]
  },
  {path: 'asciidoctor-panel', component: AsciiDoctorPanelDemo},
  {
    path: 'authorization-service',
    component: AuthorizationServiceDemoContainer,
    canActivate: [SignedInGuard]
  },
  {path: 'sign-in-panel', component: SignInPanelDemo},
  {path: 'sign-in', component: SignInPageComponent},
  {path: 'inline-profile', component: InlineProfileDemo}
];
@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {
}
