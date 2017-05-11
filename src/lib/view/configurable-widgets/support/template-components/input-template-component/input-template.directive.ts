import {Directive, ViewContainerRef} from '@angular/core'

/**
 * Used for templates.
 */
@Directive({
  selector: '[tanj-input-template-host]',
})
export class InputTemplateDirective {
  constructor(public viewContainerRef: ViewContainerRef) {
  }
}
