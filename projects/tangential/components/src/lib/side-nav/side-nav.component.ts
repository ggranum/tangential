import {
  animate,
  state,
  style,
  transition,
  trigger
} from '@angular/animations'
import * as KeyCodes from '@angular/cdk/keycodes'
import {
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  Output,
  ViewEncapsulation
} from '@angular/core'

@Component({
  selector: 'tanj-side-nav',
  template: `
              <div class="tanj-side-nav-content"
                   layout="column"
                   layout-align="start">
                <ng-content></ng-content>
              </div>`,
  encapsulation: ViewEncapsulation.None,
  host: {
    '(window:keydown)':  'handleKeyDown($event)',
    '(window:mouseup)':  'handleClick($event)',
    '(window:touchend)': 'handleClick($event)',
  },
  animations: [
    /** @todo: ggranum: Move the overflow and display attributes to simple 'ngIf' or [class] bindings */
    trigger('openedChange', [
      state('0', style({ width: '0', overflow: 'hidden', display:  'none' })),
      state('1', style({width: '*'})),
      transition('0 => 1', animate('.3s ease-in')),
      transition('1 => 0', animate('.3s ease-out'))]
    )
  ]
})
export class SideNavComponent {

  lastActionTime: number = Date.now()
  @Output() onClose: EventEmitter<null> = new EventEmitter(false)
  @Output() onOpen: EventEmitter<null> = new EventEmitter(false)
  @Input() opened: boolean = false
  @Output() openedChange: EventEmitter<boolean> = new EventEmitter(false)

  constructor(private el: ElementRef) {

  }

  @HostBinding('@openedChange')
  get hbOc() {
    return this.opened
  }

  handleKeyDown(event: KeyboardEvent) {
    if (event.keyCode === KeyCodes.ESCAPE && this.opened) {
      this.close();
      event.stopPropagation();
    }
  }

  onTransitionEnd(transitionEvent: TransitionEvent) {
  }

  open() {
    if (!this.opened && !this.inProgress()) {
      this.opened = true
      this.notify()
    }
  }

  close() {
    if (this.opened && !this.inProgress()) {
      this.opened = false
      this.notify()
    }
  }

  toggle() {
    if (!this.inProgress()) {
      this.opened = !this.opened
      this.notify()
    }
  }

  inProgress(): boolean {
    return this.opening() || this.closing()
  }

  opening(): boolean {
    return this.opened && ( Date.now() - this.lastActionTime < 250)
  }

  closing(): boolean {
    return !this.opened && (Date.now() - this.lastActionTime < 250)
  }

  handleClick(event: any) {
    if (this.opened && !this.opening()) {
      this.close()
    }
  }

  isTargetingSelfOrChild(event: any): boolean {
    let result = false
    let p = event.target
    while (p.parentElement) {
      p = p.parentElement
      if (p === this.el.nativeElement) {
        result = true
        break
      }
    }
    return result
  }

  private notify() {
    this.lastActionTime = Date.now()
    this.openedChange.emit(this.opened)
    if (this.opened) {
      this.onOpen.emit()
    } else {
      this.onClose.emit()
    }
  }
}
