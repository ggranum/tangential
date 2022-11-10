import {ComponentType} from '@angular/cdk/portal'
import {Injectable} from '@angular/core'


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
