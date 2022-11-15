import {CommonModule} from '@angular/common';
import {MatButtonModule} from '@angular/material/button'
import {MatCheckboxModule} from '@angular/material/checkbox'
import {MatIconModule} from '@angular/material/icon'
import {MatListModule} from '@angular/material/list'
import {MatToolbarModule} from '@angular/material/toolbar'
import {RouterModule} from '@angular/router';

import {NgModule} from '@angular/core';
//noinspection ES6PreferShortImport
import {DataListComponent, DataListExpander} from './data-list';
//noinspection ES6PreferShortImport
import {IconComponent} from './icon';
//noinspection ES6PreferShortImport
import {PaginationBarComponent} from './pagination-bar';
//noinspection ES6PreferShortImport
import {PageBodyComponent} from './page-body';
// noinspection ES6PreferShortImport
import {BottomNavComponent} from './bottom-nav';
// noinspection ES6PreferShortImport
import {NavButtonComponent} from './bottom-nav';
// noinspection ES6PreferShortImport
import {AppBarComponent} from './app-bar';
// noinspection ES6PreferShortImport
import {NotificationBarComponent} from './notification-bar';
// noinspection ES6PreferShortImport
import {Accordion, AccordionItem} from './accordion';
// noinspection ES6PreferShortImport
import {SideNavComponent} from './side-nav';
// noinspection ES6PreferShortImport
import {SideNavMenuComponent} from './side-nav-menu';


@NgModule({
  imports:         [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    MatToolbarModule,
    MatListModule,
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
