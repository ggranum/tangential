import {Component, ViewEncapsulation} from '@angular/core';
import {VisitorService, SignInState} from "@tangential/authorization-service";
import {AuthUser} from "@tangential/media-types";
import {Observable} from "rxjs";
import {Router} from "@angular/router";


export const NAV_ITEMS = [
  {name: 'Asciidoctor-panel', route: 'asciidoctor-panel'},
  {name: 'Authorization-service', route: 'authorization-service'},
  {name: 'Admin Panel Demo', route: 'admin-demo'},
  {name: 'Inline Profile', route: 'inline-profile'},
  {name: 'Sign In Panel Demo', route: 'sign-in-panel'},
];

@Component({
  selector: 'app',
  providers: [],
  templateUrl: 'app.html',
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent {
  signInState$:Observable<SignInState>
  visitor$:Observable<AuthUser>

  navItems = NAV_ITEMS

  constructor(private router:Router, private visitorService: VisitorService) { }

  ngOnInit(){
    this.signInState$ = this.visitorService.signInState$().map((state) => {
      console.log('AuthorizationServiceDemoContainer', 'signInState', state)
      return state
    })
    this.visitor$ = this.visitorService.signOnObserver().map((visitor) => {
      console.log('AuthorizationServiceDemoContainer', 'Visitor', visitor)
      return visitor
    })
  }

  onSignOut(visitorId:string){
    console.log('DemoApp', 'onSignOut', visitorId)
    this.visitorService.signOut().then(()=>{
      console.log('DemoApp', 'Signed out')
    })
  }

  navigateToAdmin() {
    this.router.navigate(['./admin-demo']);
  }
}
