import {ChangeDetectionStrategy, Component, HostBinding, ViewEncapsulation} from '@angular/core'
import {MdDialogRef} from '@angular/material'


@Component({
  selector:        'tanj-capture-edit-help-dialog',
  templateUrl:     './capture-edit-help-dialog.html',
  encapsulation:   ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.Default
})
export class CaptureEditHelpDialog {

  @HostBinding('attr.layout') flexL = 'column'
  @HostBinding('attr.layout-align') flexLA = 'start'
  @HostBinding('style.height') _height = '100%'
  @HostBinding('style.width') _width: string = '100%'
  @HostBinding('style.max-width') mw = '100%'

  heading: string = 'Help: Edit Capture'

  constructor(public dialogRef: MdDialogRef<CaptureEditHelpDialog>) {
  }

  onCloseRequest() {
    this.dialogRef.close()
  }


}

