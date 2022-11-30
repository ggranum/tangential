import {animate, state, style, transition, trigger} from '@angular/animations'
import {Component, EventEmitter, HostBinding, Input, OnDestroy, Output, ViewEncapsulation} from '@angular/core'


export interface AccordionChangeEvent {
  item: AccordionItem
  collapsed: boolean
}


@Component({
  selector: 'tanj-accordion',
  template: '<ng-content></ng-content>',
  encapsulation: ViewEncapsulation.None,
})
export class Accordion {

  @HostBinding('class.tanj-nested-accordion-parent') get _nested() {
    return this.nested
  }

  @Input() single: boolean = false
  @Input() nested: boolean = false

  @Output() childCollapsedChange: EventEmitter<AccordionChangeEvent> = new EventEmitter(false)

  items: Array<AccordionItem> = [];

  constructor() {
    this.childCollapsedChange.subscribe({
      next: (event) => this.onChildCollapsedChange(event)
    })
  }

  onChildCollapsedChange(event: AccordionChangeEvent) {
    if (!event.collapsed && this.single) {
      this.closeOthers(event.item)
    }
  }

  addGroup(accordionItem: AccordionItem): void {
    this.items.push(accordionItem);
    accordionItem.collapsedChange.subscribe({
      next: (v) => {
        this.childCollapsedChange.emit({item: accordionItem, collapsed: v})
      }
    })
  }

  closeOthers(accordionItem: AccordionItem): void {
    this.items.forEach((item: AccordionItem) => {
      if (item !== accordionItem) {
        item.collapsed = true;
      }
    });
  }

  removeGroup(group: AccordionItem): void {
    const index = this.items.indexOf(group);
    if (index !== -1) {
      this.items.splice(index, 1);
    }
  }
}


@Component({
  selector:      'tanj-accordion-item',
  template:      `
                   <div class="tanj-item-header-container"
                        flex
                        layout="row"
                        layout-align="start center"
                        [ngClass]="{'tanj-collapsed': collapsed}"
                        (click)="toggleCollapsed($event)">
                     <mat-icon class="no-select" [@iconChange]="collapsed">keyboard_arrow_down</mat-icon>
                     <ng-content select="[tanj-header]"></ng-content>
                   </div>
                   <div class="tanj-item-content-container"
                        flex
                        layout="column"
                        layout-align="start"
                        [@collapseChange]="collapsed">
                     <div class="tanj-item-content">
                       <ng-content select="[tanj-content]"></ng-content>
                     </div>
                   </div>

                 `,
  encapsulation: ViewEncapsulation.None,
  animations:    [
    trigger('collapseChange', [
      state('1',
        style({height: '0', overflow: 'hidden'}),
      ),
      state('0',
        style({height: '*'})
      ),
      transition('* => *', animate('.25s ease-in'))
    ]),
    trigger('iconChange', [
      state('1',
        style({transform: 'rotate( -90deg )'})
      ),
      state('0',
        style({transform: 'rotate( 0deg )'})
      ),
      transition('* => *', animate('.25s'))
    ])
  ],

})
export class AccordionItem implements OnDestroy {

  @HostBinding('class.panel-open') get po() {
    return !this.collapsed
  }

  @HostBinding('attr.flex') flex = '';
  @HostBinding('attr.layout') flexLayout = 'column';
  @HostBinding('attr.layout-align') flexLayoutAlign = 'start';


  private _collapsed: boolean = true;


  @Output() collapsedChange: EventEmitter<boolean> = new EventEmitter(false)

  constructor(public accordion: Accordion) {
    this.accordion.addGroup(this);
  }

  ngOnDestroy() {
    this.accordion.removeGroup(this);
  }

  @Input() set collapsed(value: boolean) {
    if (this._collapsed !== value) {
      this._collapsed = value
      this.collapsedChange.next(value)
    }
  }

  get collapsed() {
    return this._collapsed;
  }

  toggleCollapsed(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation()
    this.collapsed = !this.collapsed;
  }
}
