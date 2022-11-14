import {ComponentType} from '@angular/cdk/portal'
import {Injectable} from '@angular/core'

/** @todo: This is a stub. Probably not worth leaving in until there is time to actually implement it.  */
@Injectable()
export class HelpServiceLocal {

  // @ts-ignore
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
