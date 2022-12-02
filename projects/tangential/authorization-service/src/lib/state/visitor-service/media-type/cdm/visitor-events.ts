import {ObjMap} from '@tangential/core';
import {VisitorEventsDocModel} from '../doc-model/visitor-events';

export class VisitorEvents {
  signIn: ObjMap<number>



  static fromDocModel(model:VisitorEventsDocModel):VisitorEvents {
    let cdm = new VisitorEvents()
    cdm.signIn = Object.assign({}, model.signIn)
    return cdm
  }
}
