import {IconIF} from '@tangential/components'
import {
  BusMessage,
  generatePushID,
  MessageBus,
  ObjectUtil
} from '@tangential/core'
import {Observable} from 'rxjs/Observable'
export type NotificationType = 'error' | 'info' | 'warning'
export const NotificationTypes = {
  'error':   <NotificationType>'error',
  'info':    <NotificationType>'info',
  'warning': <NotificationType>'warning'
}

export interface NotificationIF {
  $key?: string
  subType?: NotificationType
  message?: string
  icon?: IconIF
  duration?: number
}

const defaultNotification: NotificationIF = {
  subType:  NotificationTypes.error,
  icon:     null,
  message:  'Unknown Error',
  duration: 5000
}

export class NotificationMessage extends BusMessage implements NotificationIF {
  static TYPE = 'NotificationMessage'

  $key?: string
  subType: NotificationType
  message?: string
  icon?: IconIF
  duration?: number

  constructor(config?: NotificationIF) {
    super(NotificationMessage.TYPE)
    this.$key = generatePushID()
    ObjectUtil.assignDeep(this, defaultNotification, config || {})
  }

  /**
   * Returns an observable that will complete after a single response.
   */
  response(bus: MessageBus): Observable<NotificationResponseMessage> {
    return bus.all.first(
      msg => msg.type === NotificationResponseMessage.TYPE && (<NotificationResponseMessage>msg).notice.$key === this.$key)
  }

  /**
   * Returns an observable that will fire on every response and will never complete.
   */
  responses(bus: MessageBus): Observable<NotificationResponseMessage> {
    return bus.all.filter(
      msg => msg.type === NotificationResponseMessage.TYPE && (<NotificationResponseMessage>msg).notice.$key === this.$key)
  }

  static info(config: NotificationIF): NotificationMessage {
    config.subType = NotificationTypes.info
    return new NotificationMessage(config)
  }

  static warning(config: NotificationIF): NotificationMessage {
    config.subType = NotificationTypes.warning
    return new NotificationMessage(config)
  }

  static error(config: NotificationIF): NotificationMessage {
    config.subType = NotificationTypes.error
    return new NotificationMessage(config)
  }

  static filter(bus: MessageBus): Observable<NotificationMessage> {
    return bus.all.filter(msg => msg.type === NotificationMessage.TYPE)
  }
}

export class NotificationResponseMessage extends BusMessage {
  static TYPE = 'NotificationMessageResponse'


  constructor(public notice: NotificationMessage, public response: any) {
    super('NotificationResponse')
  }

  static filter(bus: MessageBus) {
    return bus.all.filter(msg => msg.type === NotificationResponseMessage.TYPE)
  }

  static responseFor(notification: NotificationMessage, response: any) {
    return new NotificationResponseMessage(notification, response)
  }
}
