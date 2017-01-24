import {
  Component, ChangeDetectionStrategy, ViewEncapsulation, OnInit, QueryList, ContentChildren, ViewChild, ViewChildren
} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {UserService, RoleService} from "@tangential/authorization-service";
import {AuthUser, AuthRole} from "@tangential/media-types";
import {Observable} from "rxjs";

@Component({
  selector: 'tg-admin-page',
  template: `<div class='admin-page-content' layout="row" layout-align="center">
  <md-tab-group flex color="primary" [(selectedIndex)]="selectedTabIndex">
    <md-tab label="Users">
      <tg-user-manager *ngIf="selectedTabIndex==0" ></tg-user-manager>
    </md-tab>
    <md-tab label="Roles">
      <tg-role-manager *ngIf="selectedTabIndex==1"></tg-role-manager>
    </md-tab>
    <md-tab label="Permissions">
      <tg-permission-manager *ngIf="selectedTabIndex==2"></tg-permission-manager>
    </md-tab>
    <md-tab label="Test">
      <tg-permission-manager-direct *ngIf="selectedTabIndex==3"></tg-permission-manager-direct>
    </md-tab>
  </md-tab-group>
</div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class AdminPage implements OnInit {


  selectedTabIndex: number = 0
  tabLabels = [
    'Users',
    'Roles',
    'Permissions',
    'Test'
  ]


  constructor(private route: ActivatedRoute) {

  }

  ngOnInit() {
    let tab = this.route.snapshot.params['tab']
    if (tab) {
      this.selectedTabIndex = this.tabLabels.indexOf(tab)
      if (this.selectedTabIndex == -1) {
        this.selectedTabIndex = 0
      }

    }
  }

}
