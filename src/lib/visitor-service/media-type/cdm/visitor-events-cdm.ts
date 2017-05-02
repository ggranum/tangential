import {ObjMap} from '@tangential/core';
import {VisitorEventsDocModel} from '@tangential/visitor-service';

export class VisitorEventsCdm {
  signIn: ObjMap<number>



  static fromDocModel(model:VisitorEventsDocModel):VisitorEventsCdm {
    let cdm = new VisitorEventsCdm()
    cdm.signIn = Object.assign({}, model.signIn)
    return cdm
  }
}
