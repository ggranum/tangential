import {Component} from '@angular/core';


@Component({
  selector: 'asciidoctor-panel-demo',
  templateUrl: 'asciidoctor-panel-demo.html',
  styleUrls: ['asciidoctor-panel-demo.scss'],
})
export class AsciiDoctorPanelDemo {
  asciidoctorContent: string;


  constructor() {
    this.asciidoctorContent = this.asciidoctorContent = `
= Welcome to the Tangential Project 
Author <geoff.granum@gmail.com>

Tangential is a set of reusable, individually installable components, packaged similarly to Angular Material2 [edit:how it used to be packaged!]. 

Tangential focuses on widgets that are completely functional - a sign-in dialog that uses Reactive style patterns (from RxJS) to allow users to create accounts and sign-in, for example. However, it is our intention to enable reuse of the visual, UX components as standalone, developer-modifiable widgets.

Some widgets, such as this one that is displaying AsciiDoc content, are purely UX; they have no dependencies on Firebase or on core/base service classes provided by Tangential. Others might have 'containers' that depend on core Tangential libraries and an active Firebase instance, but the component itself will be consumable without those dependencies. 

So for now, please feel free to bounce around this demo. Create an account and sign in. Navigate to the link:./admin[admin console] 

== Frameworks & technologies used by various Tangential components: 

* https://angular.io[Angular2]
* https://github.com/angular/material2/[Angular Material 2]
* https://firebase.google.com[Firebase]



`
  }
}
