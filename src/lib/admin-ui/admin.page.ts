import {Component, ChangeDetectionStrategy, ViewEncapsulation, OnInit} from "@angular/core";
import {Params, ActivatedRoute} from "@angular/router";

@Component({
  selector: 'tang-admin-page',
  template: `<div class='admin-page-content' layout="row" layout-align="center">
  <md-tab-group flex color="primary" [selectedIndex]="1">
    <md-tab label="Users">
      <tang-user-list></tang-user-list>
    </md-tab>
    <md-tab label="Roles">
      <tang-role-list></tang-role-list>
    </md-tab>
    <md-tab label="Permissions">
      <tang-permission-list></tang-permission-list>
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
