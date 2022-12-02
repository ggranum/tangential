import {filter, Observable} from 'rxjs'
import {BusMessage, BusMessageIntent, MessageBus} from '../message-bus'

export class AppMessage extends BusMessage {
  static SourceKey: string = 'App'

  static SignOutRequest = 'signOutRequest'

  constructor(intent:BusMessageIntent, key:string) {
    super(AppMessage.SourceKey, intent, key)
  }

  static filter(bus:MessageBus):Observable<AppMessage>{
    return bus.all.pipe(filter(msg => msg.source === AppMessage.SourceKey))
  }

  static signOutRequest() {
    return new AppMessage('request', AppMessage.SignOutRequest)
  }
}
