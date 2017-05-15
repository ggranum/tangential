import {BusMessage, MessageBus} from '@tangential/core'
import {Observable} from 'rxjs/Observable'
import {MenuItem} from './menu';





export class ContextMenuMessage extends BusMessage {
  static TYPE = 'ContextMenuMessage'
  menuItems: MenuItem[]

  constructor(menuItems: MenuItem[]) {
    super(ContextMenuMessage.TYPE)
    this.menuItems = menuItems
  }


  static post(bus: MessageBus, menuItems: MenuItem[]): void {
    bus.post(new ContextMenuMessage(menuItems))
  }

  static filter(bus: MessageBus): Observable<ContextMenuMessage> {
    return bus.all.filter(msg => msg.type === ContextMenuMessage.TYPE)
  }

}
