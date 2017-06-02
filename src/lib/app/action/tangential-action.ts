import {AuthSubject} from '@tangential/authorization-service'

export type TangentialActionKey = string

export abstract class TangentialAction {

  $key: TangentialActionKey

  constructor(protected subject: AuthSubject) {
  }

  perform(): Promise<any> {
    this.checkAuthorizations()
    return this.doPerform()
  }

  checkAuthorizations() {

  }

  protected abstract doPerform(): Promise<any>
}
