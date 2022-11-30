import {NgModule} from '@angular/core';
import {AdminService, FirebaseAdminService} from '@tangential/authorization-service';
import {AdminConsoleLibService} from '@tangential/admin-console-lib';
import {AdminConsoleLibModule} from '@tangential/admin-console-lib';

/**
 * It is not possible (or doesn't seem to be possible) to lazy-load a module directly from an NPM imported project.
 * This module re-export provides a stub that will be compiled by the child project, providing a stable lazy-load target for
 * routing modules.
 *
 *
 * There is some likelihood that if we did a full AOT compile before Publishing to NPM that the required files would be generated, and
 * we wouldn't need to use a re-export module like this. It's worth investigating in the future, but for now stubs like this are easy,
 * easy to understand, and very fast by comparison.
 */
@NgModule({
  imports:      [
    AdminConsoleLibModule
  ],
  providers:    [
    {provide: AdminService, useClass: FirebaseAdminService}
  ]

})
export class ExtTanjAdminConsoleModule {

}
