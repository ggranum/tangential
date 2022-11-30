import {filter} from 'rxjs/operators'

import { BusMessage, BusMessageIntent, Intention, MessageBus } from '@tangential/core'
import {Observable} from 'rxjs'


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


export class AppToggleMainMenuRequest extends AppMessage {
  static Key = 'openAppNavRequest'

  constructor() {
    super(Intention.request, AppToggleMainMenuRequest.Key )
  }

  static override filter(bus:MessageBus):Observable<AppToggleMainMenuRequest>{
    return bus.all.pipe(filter(msg => msg.source === AppMessage.SourceKey && msg.key === AppToggleMainMenuRequest.Key))
  }
}



