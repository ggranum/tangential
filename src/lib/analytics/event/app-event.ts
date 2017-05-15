import {BusMessage} from '@tangential/core'


export class AppEventMessage extends BusMessage {
  static OpenAppNavRequest = 'appEvent:openAppNavRequest'
  static SignOutRequest = 'appEvent:signOutRequest'

  constructor(public subtype: string) {
    super(subtype)
  }

  static openAppNavRequest(): AppEventMessage {
    return new AppEventMessage(AppEventMessage.OpenAppNavRequest)
  }

  static signOutRequest() {
    return new AppEventMessage(AppEventMessage.SignOutRequest)
  }
}
