import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChange,
  ViewEncapsulation
} from '@angular/core'
import {Icon} from './icon'

@Component({
  selector:            'tanj-icon', template: `
    <div flex class="tanj-icon-body"
         [ngClass]="{'tanj-icon-align-center': align=='center'}"
         layout="row" layout-align="start center"
         (click)="onClick($event)">
      <i
        class="tanj-icon-element"
        [ngClass]="classes"
        aria-hidden="true">{{iconContainerContent}}</i>
      <ng-container *ngIf="label"><span class="tanj-icon-label">{{label}}</span></ng-container>
    </div>
                       `, host: {
    '[class.no-select]': 'true', '[class.tanj-disabled]': 'disabled', '[class.tanj-labeled-icon]': 'label',
  }, styles:           [
      `
      /* Increase in specificity is intentional, to override Angular Material styles.*/
      tanj-icon i.tanj-icon-element {
        font-size : inherit;
      }

      tanj-icon {
        font-size : 24px;
      }

      tanj-icon .tanj-icon-body {
        width : 100%;
      }

      tanj-icon .tanj-icon-body.tanj-icon-align-center {
        justify-content : center;
      }

      tanj-icon.tanj-labeled-icon .tanj-icon-element {
        text-align   : right;
        min-width    : 1em;
        margin-right : .25em;
      }

      .tanj-icon-label {
        font-size : 12px;
      }
    `], encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.OnPush
})
export class IconComponent implements OnChanges, OnInit {

  @Input() icon: Icon

  @Input() align: string

  @Input() font: string = 'material-icons'
  @Input() ligature: string = 'broken_image'

  iconContainerContent: string

  @Input() disabled: boolean
  @Input() label: string

  @Output() click: EventEmitter<MouseEvent> = new EventEmitter(false)


  classes: any

  constructor() {
  }

  public ngOnInit() {
    this.updateClasses()
  }

  public ngOnChanges(changes: { icon: SimpleChange }): void {
    if (changes.icon) {
      if (this.icon) {
        this.font = this.icon.font
        this.ligature = this.icon.name
      }
    }
    this.font = this.font || 'material-icons'
    this.ligature = this.ligature || 'broken_image'
    this.updateClasses()
  }

  onClick(event: MouseEvent) {
    console.log('IconComponent', 'onClick')
    if (!this.disabled) {
      this.click.emit(event)
    }
  }


  private updateClasses() {
    this.classes = {}
    this.classes[this.font] = true
    if (this.font === 'fa') {
      const key = this.ligature.startsWith('fa-') ? this.ligature : 'fa-' + this.ligature
      this.classes[key] = true
    } else {
      this.iconContainerContent = this.ligature
    }
    if (!this.label && !this.align) {
      this.align = 'center'
    }
  }
}



