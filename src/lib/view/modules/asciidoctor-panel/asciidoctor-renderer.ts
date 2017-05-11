import {ElementRef} from '@angular/core';

declare const Asciidoctor: any;

export class AsciidoctorPanelRenderer {

  private viewPanelEl: HTMLElement;
  private contentHtml: string;

  constructor(private elementRef: ElementRef) {
    this.viewPanelEl = elementRef.nativeElement.querySelector('.tanj-asciidoctor-body');
  }

  updateContent(content: string) {
    if (Asciidoctor) {
      const options: any = {doctype: 'article', attributes: ['showtitle']}
      const ad = Asciidoctor();
      this.contentHtml = ad.convert(content, options)
      this.viewPanelEl.innerHTML = this.contentHtml
    } else {
      console.log('AsciidoctorPanelRenderer', 'AsciiDoctor script not found')
    }
  }

}
