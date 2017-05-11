import {AfterViewInit, ViewContainerRef} from '@angular/core'

//

/**
 * Works, but shouldn't use it yet.
 */
// @Directive({
//   selector: '[i18n]'
// })
export class I18nDirective implements AfterViewInit {

  constructor(private ref: ViewContainerRef) {
  }

  ngAfterViewInit() {
    const x = this.ref.element.nativeElement['innerText']
    if (x) {
      console.log('I18nDirective', 'ngAfterViewInit', x)
    }
  }

}
