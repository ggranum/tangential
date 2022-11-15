import {BusMessage, MessageBus, ObjectUtil} from '@tangential/core'
import {Observable} from 'rxjs'
import {filter, first} from 'rxjs/operators'
import {IconIF} from '../icon/icon'

export type NotificationType = 'error' | 'info' | 'warning'
export const NotificationTypes = {
  'error':   <NotificationType>'error',
  'info':    <NotificationType>'info',
  'warning': <NotificationType>'warning'
}

export interface NotificationIF {
  $key?: string
  duration?: number
  icon?: IconIF
  level?: NotificationType
  message?: string
}

const defaultNotification: NotificationIF = {
  level:    NotificationTypes.error,
  icon:     null,
  message:  'Unknown Error',
  duration: 5000
}

export class NotificationMessage extends BusMessage implements NotificationIF {
  static SourceKey = 'NotificationMessage'

  $key?: string
  duration?: number
  icon?: IconIF
  message?: string

  constructor(config: NotificationIF) {
    super(NotificationMessage.SourceKey, 'event', config.level)
    ObjectUtil.assignDeep(this, defaultNotification, config)
  }

  /**
   * Returns an observable that will complete after a single response.
   */
  response(bus: MessageBus): Observable<NotificationResponseMessage> {
    return bus.all.pipe(
      first(msg => msg.source === NotificationResponseMessage.SourceKey && (<NotificationResponseMessage>msg).notice.id === this.id)
    ) as Observable<NotificationResponseMessage>
  }

  /**
   * Returns an observable that will fire on every response and will never complete.
   */
  responses(bus: MessageBus): Observable<NotificationResponseMessage> {
    return bus.all.pipe(
      filter(msg => msg.source === NotificationResponseMessage.SourceKey && (<NotificationResponseMessage>msg).notice.id === this.id)
    ) as Observable<NotificationResponseMessage>
  }

  static info(config: NotificationIF): NotificationMessage {
    config.level = NotificationTypes.info
    return new NotificationMessage(config)
  }

  static warning(config: NotificationIF): NotificationMessage {
    config.level = NotificationTypes.warning
    return new NotificationMessage(config)
  }

  static error(config: NotificationIF): NotificationMessage {
    config.level = NotificationTypes.error
    return new NotificationMessage(config)
  }

  static filter(bus: MessageBus): Observable<NotificationMessage> {
    return bus.all.pipe(filter(msg => msg.source === NotificationMessage.SourceKey)) as Observable<NotificationMessage>
  }
}

export class NotificationResponseMessage extends BusMessage {
  static SourceKey: string = 'NotificationResponse'


  constructor(public notice: NotificationMessage, public response: any) {
    super(NotificationResponseMessage.SourceKey, 'event')
  }

  static filter(bus: MessageBus) {
    return bus.all.pipe(filter(msg => msg.source === NotificationResponseMessage.SourceKey))
  }

  static responseFor(notification: NotificationMessage, response: any) {
    return new NotificationResponseMessage(notification, response)
  }
}
