import {NgModule} from '@angular/core'


import {CommonModule} from '@angular/common'

import {MdButtonModule} from '@angular/material/button/button'
import {MdIconModule} from '@angular/material/icon/icon'
import {MdInputModule} from "@angular/material/input";
import {MdListModule} from '@angular/material/list'
import {MdCheckboxModule} from '@angular/material/checkbox'

import {DataListComponent, DataListExpander} from './data-list.component'
import {FlexLayoutModule} from "@angular/flex-layout";


@NgModule({
  declarations: [
    DataListComponent,
    DataListExpander
  ],
  imports: [
    FlexLayoutModule,
    CommonModule,
    MdButtonModule,
    MdIconModule,
    MdInputModule,
    MdListModule,
    MdCheckboxModule
  ],
  exports: [
    DataListComponent,
    DataListExpander,
  ]
})
export class DataListModule {

}
