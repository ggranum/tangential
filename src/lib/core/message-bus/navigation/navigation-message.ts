//noinspection ES6UnusedImports
import {GaFunction} from '@tangential/analytics'
import {Observable} from 'rxjs'
import {filter} from 'rxjs/operators'
import {
  BusMessage,
  MessageBus
} from '../message-bus'


export class NavigationMessage extends BusMessage {
  static SourceKey = 'NavigationMessage'
  path: string
  additionalMessage: string
  constructor(key:string, path: string, additionalMessage?:string) {
    super(NavigationMessage.SourceKey, 'notification', key)
    this.path = path
    this.additionalMessage = additionalMessage
  }

  static filter(bus: MessageBus):Observable<BusMessage> {
    return bus.all.pipe(filter(m => m.source === NavigationMessage.SourceKey))
  }
}


export class NavigationRequiresAuthenticationMessage extends NavigationMessage {
  static Key: string = 'requiresAuthentication'

  constructor(path: string) {
    super(NavigationRequiresAuthenticationMessage.Key, path)
  }

  static post(bus: MessageBus, path: string) {
    bus.post(new NavigationRequiresAuthenticationMessage(path))
  }
}

export class NavigationRequiresRoleMessage extends NavigationMessage {
  static Key: string = 'requiresRole'

  constructor(path: string, public roleKey: string) {
    super(NavigationRequiresRoleMessage.Key, path, 'Role Required: ' + roleKey)
  }

  static post(bus: MessageBus, path: string, roleKey: string) {
    bus.post(new NavigationRequiresRoleMessage(path, roleKey))
  }
}


export class NavigationRequiresPermissionMessage extends NavigationMessage {
  static SubKey: string = 'requiresPermission'

  constructor(path: string, public permissionKey: string) {
    super(NavigationRequiresPermissionMessage.SubKey, path, 'Permission Required: ' + permissionKey)
  }


  static post(bus: MessageBus, path: string, roleKey: string) {
    bus.post(new NavigationRequiresPermissionMessage(path, roleKey))
  }


}




