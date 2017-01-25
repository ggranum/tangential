import {ElementRef} from "@angular/core";
export class AsciidoctorPanelRenderer {

  private _viewPanelEl: HTMLElement;
  private _contentHtml: string;

  constructor(private _elementRef: ElementRef) {
    this._viewPanelEl = _elementRef.nativeElement.querySelector('.tg-asciidoctor-body');
  }

  updateContent(content: string) {
    // silly compile hack.
    // Fixes "Element implicitly has an 'any' type because index expression is not of type 'number'" error.
    let x: any = window
    let Opal: any = x['Opal']
    let options: any = Opal.hash({doctype: 'article', attributes: ['showtitle']});

    if(!content){
      content = ""
    }
    this._contentHtml = Opal.Asciidoctor.$convert(content, options);
    this._viewPanelEl.innerHTML = this._contentHtml
  }
}
