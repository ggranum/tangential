import {ChangeDetectionStrategy, Component, HostBinding, ViewEncapsulation} from '@angular/core'
import {MdDialogRef} from '@angular/material'


@Component({
  templateUrl:     './report-edit-help-dialog.html',
  encapsulation:   ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.Default
})
export class ReportEditHelpDialog {

  @HostBinding('attr.layout') flexL = 'column'
  @HostBinding('attr.layout-align') flexLA = 'start'
  @HostBinding('style.height') _height = '100%'
  @HostBinding('style.width') _width: string = '100%'
  @HostBinding('style.max-width') mw = '100%'


  heading: string = 'Help: Edit Report'

  constructor(public dialogRef: MdDialogRef<ReportEditHelpDialog>) {
  }

  onCloseRequest() {
    this.dialogRef.close()
  }

}


