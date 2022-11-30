import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field'
import {RouterModule} from '@angular/router';
import {TanjComponentsModule} from '../../../../projects/tangential/components/src/lib';
import {AdsenseModule} from '../../../../projects/tangential/analytics/src/lib';
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
    MatFormFieldModule,
    AdsenseModule,
    /* Tangential*/
    TanjMaterialModule,
    TanjComponentsModule,
    RouterModule.forChild([]),
  ],
  exports: [
    ChooseIconDialog,
    MessageDialog,
    MessageDialogContainerComponent,
    MobileFooterBannerAdComponent,
    PageNotFoundComponent,
    TipDialogFooterComponent,
    MatFormFieldModule,
  ],
  declarations: [
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
