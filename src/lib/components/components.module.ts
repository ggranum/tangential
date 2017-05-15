import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';

import {NgModule} from '@angular/core';
import {MdButtonModule, MdCheckboxModule, MdIconModule, MdMenuModule, MdRippleModule, MdToolbarModule} from '@angular/material';
//noinspection TypeScriptPreferShortImport
import {DataListComponent, DataListExpander} from './data-list/data-list.component';
//noinspection TypeScriptPreferShortImport
import {IconComponent} from './icon/icon.component';
//noinspection TypeScriptPreferShortImport
import {PaginationBarComponent} from './pagination-bar/pagination-bar.component';
//noinspection TypeScriptPreferShortImport
import {PageBodyComponent} from './page-body/page-body.component';
// noinspection TypeScriptPreferShortImport
import {BottomNavComponent} from './bottom-nav/bottom-nav.component';
// noinspection TypeScriptPreferShortImport
import {NavButtonComponent} from './bottom-nav/nav-button.component';
// noinspection TypeScriptPreferShortImport
import {AppBarComponent} from './app-bar/app-bar.component';
// noinspection TypeScriptPreferShortImport
import {NotificationBarComponent} from './notification-bar/notification-bar.component';
// noinspection TypeScriptPreferShortImport
import {Accordion, AccordionItem} from './accordion/accordion.component';
// noinspection TypeScriptPreferShortImport
import {SideNavComponent} from './side-nav/side-nav.component';
// noinspection TypeScriptPreferShortImport
import {SideNavMenuComponent} from './side-nav-menu/side-nav-menu.component';


@NgModule({
  imports:         [
    CommonModule,
    RouterModule,

    MdButtonModule,
    MdCheckboxModule,
    MdIconModule,
    MdToolbarModule,


  ],
  declarations:    [
    Accordion,
    AccordionItem,
    AppBarComponent,
    BottomNavComponent,
    DataListComponent,
    DataListExpander,
    IconComponent,
    NavButtonComponent,
    NotificationBarComponent,
    PaginationBarComponent,
    PageBodyComponent,
    SideNavComponent,
    SideNavMenuComponent,
  ],
  exports:         [
    Accordion,
    AccordionItem,
    AppBarComponent,
    BottomNavComponent,
    DataListComponent,
    DataListExpander,
    IconComponent,
    NavButtonComponent,
    NotificationBarComponent,
    PaginationBarComponent,
    PageBodyComponent,
    SideNavComponent,
    SideNavMenuComponent,
  ],
  entryComponents: []
})
export class TanjComponentsModule {

}
