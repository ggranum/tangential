import { NgModule } from '@angular/core';
import { AdminConsoleLibComponent } from './admin-console-lib.component';



@NgModule({
  declarations: [
    AdminConsoleLibComponent
  ],
  imports: [
  ],
  exports: [
    AdminConsoleLibComponent
  ]
})
export class AdminConsoleLibModule {


  constructor() {
    console.log("Loading AdminConsoleLibModule YAY!");
  }
}
