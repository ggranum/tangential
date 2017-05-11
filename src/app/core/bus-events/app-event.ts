import {BusMessage} from '@tangential/core'


export class AppEventMessage extends BusMessage {
  static OpenAppNavRequest = 'appEvent:openAppNavRequest'

  constructor(public subtype: string) {
    super(subtype)
  }

  static openAppNavRequest(): AppEventMessage {
    return new AppEventMessage(AppEventMessage.OpenAppNavRequest)
  }
}
