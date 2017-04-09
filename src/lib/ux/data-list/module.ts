import {NgModule} from "@angular/core";


import {CommonModule} from "@angular/common";

import {MdButtonModule, MdCheckboxModule, MdIconModule, MdInputModule, MdListModule} from "@angular/material";

import {DataListComponent, DataListExpander} from "./data-list.component";


@NgModule({
  declarations: [
    DataListComponent,
    DataListExpander
  ],
  imports: [
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
