import {
  EventEmitter,
  Injectable
} from '@angular/core'
import {Observable} from 'rxjs/Observable'
//noinspection TypeScriptPreferShortImport
import {generatePushID} from '../util/generate-push-id'

export type BusMessageIntent = 'request' | 'action' | 'event' | 'notification' | 'log'

export const Intention = {
  /**
   * An action has been performed. For example, a user has been created, granted a permission, removed, etc.
   */
  action:       <BusMessageIntent>'action',

  /**
   * A general event, typically used to communicate UI state across domains.
   */
  event:        <BusMessageIntent>'event',

  /**
   *  A BusMessage whose intent is to record a log message.
   */
  log:          <BusMessageIntent>'log',

  /**
   * A BusMessage whose intent is to provide a message to the Visitor. It is up to the currently active UI to determine the best method
   * of sharing the message payload.
   */
  notification: <BusMessageIntent>'notification',

  /**
   * A BusMessage that communicates that the current Visitor has requested than an action be performed. For example, clicked a button
   * that is intended to result in a user being created, a permission being granted, etc.
   */
  request:      <BusMessageIntent>'request',
}


export class BusMessage {
  public id: string
  public intent: BusMessageIntent
  public key: string
  public source: string

  constructor(source: string, intent?: BusMessageIntent, key?: string) {
    this.id = generatePushID()
    this.source = source
    this.intent = intent
    this.key = key
  }
}

@Injectable()
export class MessageBus {

  public all: Observable<BusMessage>
  private bus: EventEmitter<BusMessage> = new EventEmitter(false)

  constructor() {
    this.all = this.bus.share();
  }

  post(message: BusMessage) {
    this.bus.next(message)
  }
}
