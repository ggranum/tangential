import {BusMessage, MessageBus} from '@tangential/core'
import {Observable} from 'rxjs'
import {filter} from 'rxjs/operators'
import {MenuItem} from './menu';





export class ContextMenuMessage extends BusMessage {
  static SourceKey = 'ContextMenu'
  menuItems: MenuItem[]

  constructor(menuItems: MenuItem[]) {
    super(ContextMenuMessage.SourceKey, 'event')
    this.menuItems = menuItems
  }


  static post(bus: MessageBus, menuItems: MenuItem[]): void {
    bus.post(new ContextMenuMessage(menuItems))
  }

  static filter(bus: MessageBus): Observable<ContextMenuMessage> {
    return bus.all.pipe(filter(msg => msg.source === ContextMenuMessage.SourceKey)) as Observable<ContextMenuMessage>
  }

}
