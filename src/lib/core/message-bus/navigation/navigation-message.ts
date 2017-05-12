import {BusMessage, MessageBus} from '../message-bus'
//noinspection ES6UnusedImports
import {GaFunction} from '@tangential/analytics';
import {Observable} from 'rxjs/Observable';



export class NavigationMessage extends BusMessage {
  static Key = 'nav:'
  path: string
  constructor(public subKey: string, path: string) {
    super(NavigationMessage.Key + subKey)
    this.path = path
  }

  static filter(bus: MessageBus):Observable<BusMessage> {
    return bus.all.filter(m => m.type.startsWith(NavigationMessage.Key))
  }

}


export class NavigationRequiresAuthenticationMessage extends NavigationMessage {
  static SubKey: string = 'requiresAuthentication'

  constructor(path: string) {
    super(NavigationRequiresAuthenticationMessage.SubKey, path)
  }


  static post(bus: MessageBus, path: string) {
    bus.post(new NavigationRequiresAuthenticationMessage(path))
  }


}

export class NavigationRequiresRoleMessage extends NavigationMessage {
  static SubKey: string = 'requiresRole'

  constructor(path: string, public roleKey: string) {
    super(NavigationRequiresRoleMessage.SubKey, path)
  }


  static post(bus: MessageBus, path: string, roleKey: string) {
    bus.post(new NavigationRequiresRoleMessage(path, roleKey))
  }


}




