import {ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation} from '@angular/core'
import {ActivatedRoute} from '@angular/router'

@Component({
  selector: 'tanj-admin-console-page',
  template: `
              <div class='admin-page-content' layout="row" layout-align="center">
                <md-tab-group flex color="primary" [(selectedIndex)]="selectedTabIndex">
                  <md-tab label="Users">
                    <tanj-user-manager-page *ngIf="selectedTabIndex==0"></tanj-user-manager-page>
                  </md-tab>
                  <md-tab label="Roles">
                    <tanj-role-manager-page *ngIf="selectedTabIndex==1"></tanj-role-manager-page>
                  </md-tab>
                  <md-tab label="Permissions">
                    <tanj-permission-manager *ngIf="selectedTabIndex==2"></tanj-permission-manager>
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
    const tab = this.route.snapshot.params['tab']
    if (tab) {
      this.selectedTabIndex = this.tabLabels.indexOf(tab)
      if (this.selectedTabIndex === -1) {
        this.selectedTabIndex = 0
      }

    }
  }

}
