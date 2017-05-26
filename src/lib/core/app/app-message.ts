// noinspection TypeScriptPreferShortImport
import {
  BusMessage,
  BusMessageIntent,
  Intention,
  MessageBus
} from '../message-bus/message-bus'
import {Observable} from 'rxjs/Observable'


export class AppMessage extends BusMessage {
  static SourceKey: string = 'App'

  static SignOutRequest = 'signOutRequest'

  constructor(intent:BusMessageIntent, key:string) {
    super(AppMessage.SourceKey, intent, key)
  }

  static filter(bus:MessageBus):Observable<AppMessage>{
    return bus.all.filter(msg => msg.source === AppMessage.SourceKey)
  }

  static signOutRequest() {
    return new AppMessage('request', AppMessage.SignOutRequest)
  }
}


export class AppOpenNavRequest extends AppMessage {
  static Key = 'openAppNavRequest'

  constructor() {
    super(Intention.request, AppOpenNavRequest.Key )
  }

  static filter(bus:MessageBus):Observable<AppOpenNavRequest>{
    return bus.all.filter(msg => msg.source === AppMessage.SourceKey && msg.key === AppOpenNavRequest.Key)
  }
}



