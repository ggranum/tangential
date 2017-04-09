import {ElementRef} from "@angular/core";

declare const Asciidoctor: any;

export class AsciidoctorPanelRenderer {

  private viewPanelEl: HTMLElement;
  private contentHtml: string;

  constructor(private elementRef: ElementRef) {
    this.viewPanelEl = elementRef.nativeElement.querySelector('.tg-asciidoctor-body');
  }

  updateContent(content: string) {


    if (Asciidoctor) {
      let options: any = {doctype: 'article', attributes: ['showtitle']}
      let ad = Asciidoctor();
      this.contentHtml = ad.convert(content, options)
      this.viewPanelEl.innerHTML = this.contentHtml
    } else {
      console.log('AsciidoctorPanelRenderer', 'AsciiDoctor script not found')
    }
  }

}
