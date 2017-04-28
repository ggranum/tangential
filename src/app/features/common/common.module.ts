import {CommonModule} from '@angular/common'
import {NgModule} from '@angular/core'
import {FormsModule} from '@angular/forms'
import {MdSnackBarModule} from '@angular/material'
import {RouterModule} from '@angular/router'
import {TanjComponentsModule} from '@tangential/components'
import {AdsenseModule} from '@tangential/analytics'
import {TanjMaterialModule} from '../../routing/tanj-material-module'
import {Accordion, AccordionItem} from './accordion/accordion'
import {MobileFooterBannerAdComponent} from './ad-units/mobile-footer-banner/mobile-footer-banner-ad'
import {AppBarComponent} from './app-bar/app-bar.component'
import {BottomNavComponent} from './bottom-nav/bottom-nav.component'
import {NavButtonComponent} from './bottom-nav/nav-button.component'
import {ChooseIconDialog} from './choose-icon-dialog/choose-icon-dialog'
import {MessageDialogContainerComponent} from './message-dialog-container/message-dialog-container.component'
import {MessageDialog} from './message-dialog/message.dialog'
import {NotificationBarComponent} from './notification-bar-component/notification-bar.component'
import {PageNotFoundComponent} from './page-not-found/page-not-found.component'
import {SideNavMenuComponent} from './side-nav-menu/side-nav-menu.component'
import {SideNavComponent} from './side-nav/side-nav'
import {TipDialogFooterComponent} from './tip-dialog/tip-dialog-footer/tip-dialog-footer.component'

@NgModule({
  imports:         [
    CommonModule,
    FormsModule,
    AdsenseModule,
    TanjMaterialModule,

    MdSnackBarModule,
    /* Tangential*/
    TanjComponentsModule,
    RouterModule.forChild([]),
  ],
  declarations:    [
    BottomNavComponent,
    MessageDialogContainerComponent,
    NavButtonComponent,
    PageNotFoundComponent,
    TipDialogFooterComponent,
    AppBarComponent,

    NotificationBarComponent,
    MobileFooterBannerAdComponent,
    ChooseIconDialog,

    Accordion,
    AccordionItem,

    SideNavComponent,
    SideNavMenuComponent,

    MessageDialog,
  ],
  exports:         [
    BottomNavComponent,
    MessageDialogContainerComponent,
    NavButtonComponent,
    PageNotFoundComponent,
    TipDialogFooterComponent,

    AppBarComponent,

    NotificationBarComponent,
    MobileFooterBannerAdComponent,

    ChooseIconDialog,

    Accordion,
    AccordionItem,

    SideNavComponent,
    SideNavMenuComponent,

    MessageDialog,
  ],
  entryComponents: [
    ChooseIconDialog,
    MessageDialog,
  ]
})
export class TanjCommonModule {

}
