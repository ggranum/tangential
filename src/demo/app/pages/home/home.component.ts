import {Component} from "@angular/core";
import {NAV_ITEMS} from "../../app";
@Component({
  selector: 'home',
  templateUrl: 'demo-home.html'
})
export class HomeComponent {
  navItems: any[] = NAV_ITEMS
}
