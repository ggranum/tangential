import {Injectable} from '@angular/core'
import {ComponentType} from '@angular/material'


@Injectable()
export class HelpServiceLocal {

  private _currentHelpDialog: ComponentType<any>

  public get currentHelpDialog(): ComponentType<any> {
    return this._currentHelpDialog
  }

  public set currentHelpDialog(value: ComponentType<any>) {
    this._currentHelpDialog = value
  }

  constructor() {
  }


}
