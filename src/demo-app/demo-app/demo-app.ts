import {Component, ViewEncapsulation} from '@angular/core';


@Component({
  selector: 'home',
  template: `
    <p>Why yes, this is bootstrapped from the development demos for Angular Material 2!</p>
    <p>Open the sidenav to select a demo. </p>
  `
})
export class Home {}

@Component({
  selector: 'demo-app',
  providers: [],
  templateUrl: 'demo-app.html',
  styleUrls: ['demo-app.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DemoApp {
  navItems = [
    {name: 'Button', route: 'button'},
    {name: 'Inline Profile', route: 'inline-profile'},
    {name: 'Asciidoctor-panel', route: 'asciidoctor-panel'},
    {name: 'Authorization-service', route: 'authorization-service'},
    {name: 'Admin Panel Demo', route: 'admin-demo'},
  ];
}
