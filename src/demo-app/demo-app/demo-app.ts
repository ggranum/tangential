import {Component, ViewEncapsulation, Input} from '@angular/core';


const NAV_ITEMS = [
  {name: 'Button', route: 'button'},
  {name: 'Inline Profile', route: 'inline-profile'},
  {name: 'Asciidoctor-panel', route: 'asciidoctor-panel'},
  {name: 'Authorization-service', route: 'authorization-service'},
  {name: 'Admin Panel Demo', route: 'admin-demo'},
];

@Component({
  selector: 'home',
  templateUrl: 'demo-home.html'
})
export class Home {
  navItems:any[] = NAV_ITEMS
}

@Component({
  selector: 'demo-app',
  providers: [],
  templateUrl: 'demo-app.html',
  styleUrls: ['demo-app.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DemoApp {
  navItems = NAV_ITEMS
}
