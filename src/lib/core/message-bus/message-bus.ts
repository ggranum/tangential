import {EventEmitter, Injectable} from '@angular/core'
import {Observable} from 'rxjs/Observable'
//noinspection TypeScriptPreferShortImport
import {generatePushID} from '../util/generate-push-id'

export class BusMessage {
  public id: string

  constructor(public type: string) {
    this.id = generatePushID()
  }
}

@Injectable()
export class MessageBus {

  private bus: EventEmitter<BusMessage> = new EventEmitter(false)
  public all: Observable<BusMessage>


  constructor() {
    this.all = this.bus;
  }

  post(message: BusMessage) {
    this.bus.next(message)
  }
}
