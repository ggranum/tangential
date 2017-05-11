import {ChangeDetectionStrategy, Component, HostBinding, ViewEncapsulation} from '@angular/core'
import {MdDialogRef} from '@angular/material'


@Component({
  templateUrl:     './capture-icon-list-help-dialog.html',
  encapsulation:   ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.Default
})
export class CaptureIconListHelpDialog {

  @HostBinding('class') clazz = 'tanj-themed tanj-help-dialog-component tanj-flex-column'


  heading: string = 'Help: Captures List'

  constructor(public dialogRef: MdDialogRef<CaptureIconListHelpDialog>) {
  }

  onCloseRequest() {
    this.dialogRef.close()
  }


}

