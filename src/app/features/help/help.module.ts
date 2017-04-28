import {CommonModule} from '@angular/common'
import {NgModule} from '@angular/core'
import {TanjMaterialModule} from '../../routing/tanj-material-module'
import {TanjCommonModule} from '../common/common.module'
import {CaptureEditHelpDialog} from './captures/capture-edit-help.dialog'
import {CaptureIconListHelpDialog} from './captures/capture-icon-list-help.dialog'
import {ChartEditHelpDialog} from './reports/chart-edit-help.dialog'
import {ReportEditHelpDialog} from './reports/report-edit.help.component'
import {TableEditHelpDialog} from './reports/table-edit.help.dialog'


@NgModule({
  imports:         [
    CommonModule,
    TanjCommonModule,
    TanjMaterialModule

  ],
  declarations:    [
    CaptureIconListHelpDialog,
    CaptureEditHelpDialog,
    ChartEditHelpDialog,
    TableEditHelpDialog,
    ReportEditHelpDialog,
  ],
  exports:         [
    CaptureIconListHelpDialog,
    CaptureEditHelpDialog,
    ChartEditHelpDialog,
    TableEditHelpDialog,
    ReportEditHelpDialog,
  ],
  entryComponents: [
    CaptureIconListHelpDialog,
    CaptureEditHelpDialog,
    ChartEditHelpDialog,
    TableEditHelpDialog,
    ReportEditHelpDialog,
  ]

})
export class HelpModule {
}
