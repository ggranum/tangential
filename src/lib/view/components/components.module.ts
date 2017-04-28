import {CommonModule} from '@angular/common'
import {NgModule} from '@angular/core'
import {MdButtonModule, MdCheckboxModule, MdIconModule} from '@angular/material'
//noinspection TypeScriptPreferShortImport
//noinspection TypeScriptPreferShortImport
import {DataListComponent, DataListExpander} from './data-list/data-list.component'
//noinspection TypeScriptPreferShortImport
import {IconComponent} from './icon/icon.component'
//noinspection TypeScriptPreferShortImport
import {PaginationBarComponent} from './pagination-bar/pagination-bar.component'
//noinspection TypeScriptPreferShortImport
import {PageBodyComponent} from './page-body/page-body.component';


@NgModule({
  imports:         [
    CommonModule,
    MdCheckboxModule,
    MdIconModule,
    MdButtonModule
  ],
  declarations:    [
    DataListComponent,
    DataListExpander,
    IconComponent,
    PaginationBarComponent,
    PageBodyComponent
  ],
  exports:         [
    DataListComponent,
    DataListExpander,
    IconComponent,
    PaginationBarComponent,
    PageBodyComponent
  ],
  entryComponents: []
})
export class TanjComponentsModule {

}
