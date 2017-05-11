import {IconIF} from '@tangential/components'
import {BusMessage, MessageBus} from '@tangential/core'
import {Observable} from 'rxjs/Observable'


export class ContextMenuItem {

  icon: IconIF = {
    font: 'material-icons',
    name: 'question'
  }
  label: string = ''
  disabled: boolean = false
  routerLink?: string[]
  eventHandler?: (...a: any[]) => void


  constructor(label: string, icon: IconIF, routerLink: string[], eventHandler: (...a: any[]) => void, disabled: boolean = false) {
    this.icon = icon
    this.label = label
    this.disabled = disabled
    this.eventHandler = eventHandler
    this.routerLink = routerLink
  }

  static eventHandler(label: string, icon: IconIF, eventHandler: (...a: any[]) => void, disabled: boolean = false) {
    return new ContextMenuItem(label, icon, null, eventHandler, disabled)
  }

  static routerLink(label: string, icon: IconIF, routerLink: string[], disabled: boolean = false) {
    return new ContextMenuItem(label, icon, routerLink, null, disabled)
  }

}


export class ContextMenuMessage extends BusMessage {
  static TYPE = 'ContextMenuMessage'
  menuItems: ContextMenuItem[]

  constructor(menuItems: ContextMenuItem[]) {
    super(ContextMenuMessage.TYPE)
    this.menuItems = menuItems
  }


  static post(bus: MessageBus, menuItems: ContextMenuItem[]): void {
    bus.post(new ContextMenuMessage(menuItems))
  }

  static filter(bus: MessageBus): Observable<ContextMenuMessage> {
    return bus.all.filter(msg => msg.type === ContextMenuMessage.TYPE)
  }

}
