import {Component, ChangeDetectionStrategy, ViewEncapsulation, OnInit} from "@angular/core";
import {Params, ActivatedRoute} from "@angular/router";

@Component({
  selector: 'tg-admin-page',
  template: `<div class='admin-page-content' layout="row" layout-align="center">
  <md-tab-group flex color="primary" [selectedIndex]="1">
    <md-tab label="Users">
      <tg-user-list></tg-user-list>
    </md-tab>
    <md-tab label="Roles">
      <tg-role-list></tg-role-list>
    </md-tab>
    <md-tab label="Permissions">
      <tg-permission-list></tg-permission-list>
    </md-tab>
  </md-tab-group>
</div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class AdminPage implements OnInit {


  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.forEach((params: Params) => {
    });


  }

}
