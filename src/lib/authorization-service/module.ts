import {NgModule, SkipSelf, Optional} from "@angular/core";
import {CommonModule} from "@angular/common";

/**
 * State management (including persistence) for Authentication and Authorization.
 *
 * Modules that implement other persistence mechanisms should provide their own module, replacing this one.
 *
 */
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
  ],
  providers: [ ],
  exports: []
})
export class AuthorizationServiceModule {


  constructor(@Optional() @SkipSelf() parentModule: AuthorizationServiceModule) {
    if (parentModule) {
      throw new Error(
        'AuthModule is already loaded. Import it in the AppModule only')
    }
  }
}
