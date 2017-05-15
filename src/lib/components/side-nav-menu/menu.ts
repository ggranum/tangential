import {IconIF} from '../icon/icon';

const NoOp = function(){}

export class MenuItem {
  isSeparator:boolean = false
  icon: IconIF
  label: string = ''
  disabled: boolean = false
  routerLink?: string[]
  eventHandler?: (...a: any[]) => void


  constructor(label?: string, icon?: IconIF, routerLinkOrHandler?:((...a: any[]) => void) | string[], disabled: boolean = false) {
    this.isSeparator = !label && !icon && !routerLinkOrHandler
    this.label = label
    this.icon = icon
    this.disabled = disabled
    if(routerLinkOrHandler){
      if(typeof routerLinkOrHandler == 'function'){
        this.eventHandler = routerLinkOrHandler
      }  else {
        this.routerLink = routerLinkOrHandler
      }
    }
    this.eventHandler = this.eventHandler || NoOp
  }
}



export class Menu  {

  entries: (MenuItem | Menu)[] = []

  addSeparator(){
    this.entries.push(new MenuItem())
  }

  addMenuGroup(menuGroup:Menu){
    this.entries.push(menuGroup)
  }

  addItem(item:MenuItem){
    this.entries.push(item)
  }



}
