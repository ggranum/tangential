import {Component, ViewEncapsulation} from '@angular/core';
import {VisitorService, SignInState} from "@tangential/authorization-service";
import {Observable} from "rxjs";
import {AuthUser} from "@tangential/media-types";
import {Router} from "@angular/router";


export const NAV_ITEMS = [
  {name: 'Asciidoctor-panel', route: 'asciidoctor-panel'},
  {name: 'Authorization-service', route: 'authorization-service'},
  {name: 'Admin Panel Demo', route: 'admin-demo'},
  {name: 'Inline Profile', route: 'inline-profile'},
  {name: 'Sign In Panel Demo', route: 'sign-in-panel'},
];

@Component({
  selector: 'demo-app',
  providers: [],
  templateUrl: 'demo-app.html',
  styleUrls: ['demo-app.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DemoApp {
  signInState$:Observable<SignInState>
  visitor$:Observable<AuthUser>

  navItems = NAV_ITEMS


  constructor(private _router:Router, private _visitorService: VisitorService) { }

  ngOnInit(){
    this.signInState$ = this._visitorService.signInState$().map((state) => {
      console.log('AuthorizationServiceDemoContainer', 'signInState', state)
      return state
    })
    this.visitor$ = this._visitorService.signOnObserver().map((visitor) => {
      console.log('AuthorizationServiceDemoContainer', 'Visitor', visitor)
      return visitor
    })
  }

  onSignOut(visitorId:string){
    console.log('DemoApp', 'onSignOut', visitorId)
    this._visitorService.signOut().then(()=>{
      console.log('DemoApp', 'Signed out')
    })
  }

  navigateToAdmin() {
    this._router.navigate(['./admin-demo']);
  }
}
