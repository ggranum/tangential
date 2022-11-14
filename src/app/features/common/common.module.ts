import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {RouterModule} from '@angular/router';
import {TanjComponentsModule} from '@tangential/components';
import {AdsenseModule} from '@tangential/analytics';
import {TanjMaterialModule} from '../../tanj-material-module';
import {MobileFooterBannerAdComponent} from './ad-units/mobile-footer-banner/mobile-footer-banner-ad';
import {ChooseIconDialog} from './choose-icon-dialog/choose-icon-dialog';
import {MessageDialogContainerComponent} from './message-dialog-container/message-dialog-container.component';
import {MessageDialog} from './message-dialog/message.dialog';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
import {TipDialogFooterComponent} from './tip-dialog/tip-dialog-footer/tip-dialog-footer.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AdsenseModule,
    TanjMaterialModule,
    /* Tangential*/
    TanjComponentsModule,
    RouterModule.forChild([]),
  ],
  declarations: [
    ChooseIconDialog,
    MessageDialog,
    MessageDialogContainerComponent,
    MobileFooterBannerAdComponent,
    PageNotFoundComponent,
    TipDialogFooterComponent,
  ],
  exports: [
    ChooseIconDialog,
    MessageDialog,
    MessageDialogContainerComponent,
    MobileFooterBannerAdComponent,
    PageNotFoundComponent,
    TipDialogFooterComponent,
  ],
  entryComponents: [
    ChooseIconDialog,
    MessageDialog,
  ]
})
export class TanjCommonModule {

}
