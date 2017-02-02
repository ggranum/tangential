import {Routes} from '@angular/router';
import {Home} from './demo-app';
import {ButtonDemo} from '../button/button-demo';
import {AsciiDoctorPanelDemo} from '../asciidoctor-panel/asciidoctor-panel-demo';
import {InlineProfileDemo} from "../ux/inline-profile-demo";
import {AuthorizationServiceDemoContainer} from "../authorization-service/authorization-service-demo";
import {AdminPage} from "@tangential/admin-ui";
import {SignInPanelDemo} from "@tangential/sign-in-panel";
import {SignedInGuard} from "@tangential/authorization-service";
import {SignInPageComponent} from "../pages/sign-in/sign-in-page.component";


export const DEMO_APP_ROUTES: Routes = [
  {path: '', component: Home},
  {path: 'button', component: ButtonDemo},
  {
    path: 'admin-demo',
    component: AdminPage,
    canActivate: [SignedInGuard]
  },
  {path: 'asciidoctor-panel', component: AsciiDoctorPanelDemo},
  {path: 'authorization-service', component: AuthorizationServiceDemoContainer},
  {path: 'sign-in-panel', component: SignInPanelDemo},
  {path: 'sign-in', component: SignInPageComponent},
  {path: 'inline-profile', component: InlineProfileDemo}
];
