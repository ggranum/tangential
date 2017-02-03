import {Routes} from '@angular/router';
import {HomeComponent} from './pages/home/home.component';
import {AsciiDoctorPanelDemo} from '../demo-pages/asciidoctor-panel/asciidoctor-panel-demo';
import {InlineProfileDemo} from "../demo-pages/ux/inline-profile-demo";
import {AdminPage} from "@tangential/admin-ui";
import {SignInPanelDemo} from "@tangential/sign-in-panel";
import {SignedInGuard} from "@tangential/authorization-service";
import {SignInPageComponent} from "./pages/sign-in/sign-in-page.component";
import {AuthorizationServiceDemoContainer} from "../demo-pages/authorization-service/authorization-service-demo.container";


export const DEMO_APP_ROUTES: Routes = [
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
