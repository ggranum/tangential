import {Component, EventEmitter, HostBinding, Output, ViewEncapsulation} from '@angular/core'
import {MatDialogRef} from '@angular/material/dialog'
import {IconIF} from '@tangential/components'
import {ObjectUtil} from '@tangential/core'


export interface MessageDialogOptions {
  title?: string
  content?: string
  messageIcon ?: IconIF
  type?: 'okCancel' | 'yesNo' | 'ok'
  severity?: 'info' | 'warn' | 'error'
}

export class MessageDialogResult {

  constructor(public confirmed: boolean) {
  }
}


@Component({
  selector:      'tanj-message-dialog',
  templateUrl:   './message.dialog.html',
  encapsulation: ViewEncapsulation.None
})
export class MessageDialog {

  static icons = {
    'info':  {font: 'material-icons', name: 'info'},
    'warn':  {font: 'material-icons', name: 'warning'},
    'error': {font: 'material-icons', name: 'error'}
  }

  @HostBinding('attr.layout') flexL = 'column'
  @HostBinding('attr.layout-align') flexLA = 'start'
  @HostBinding('style.height') _height = '100%'
  @HostBinding('style.width') _width: string = '100%'
  @HostBinding('style.max-width') mw = '100%'


  config: MessageDialogOptions = {
    title:    '',
    type:     'ok',
    severity: 'info',
  }
  leftButtonText: string | undefined
  rightButtonText: string | undefined

  @Output() closeRequest: EventEmitter<boolean> = new EventEmitter(false)

  constructor(public dialogRef: MatDialogRef<MessageDialog>) {

    // this.config = Object.assign({}, this.config, dialogRef['config'].data)
    if (!this.config.messageIcon) {
      this.config.messageIcon = MessageDialog.icons[this.config.severity || "info"]
    }

    if (this.config.type === 'yesNo') {
      this.leftButtonText = 'No'
      this.rightButtonText = 'Yes'
    }

  }

  set dialogConfig(config: MessageDialogOptions) {
    this.config = ObjectUtil.assignDeep({}, this.config, config)
    if (this.config.type === 'yesNo') {
      this.leftButtonText = 'No'
      this.rightButtonText = 'Yes'
    }
  }

  onRejectClick() {
    this.dialogRef.close(new MessageDialogResult(false))
  }

  onConfirmClick() {
    this.dialogRef.close(new MessageDialogResult(true))
  }

}
