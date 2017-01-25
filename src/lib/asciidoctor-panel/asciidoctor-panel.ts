import {
  Component,
  ElementRef,
  ChangeDetectionStrategy,
  Input,
  AfterContentInit,
  NgModule,
  ModuleWithProviders,
  ViewEncapsulation,
} from '@angular/core';

import 'asciidoctorjs-web-repack/asciidoctor-all.min'


@Component({
  selector: 'tg-asciidoctor-panel',
  templateUrl: 'asciidoctor-panel.html',
  styleUrls: ['asciidoctor-panel.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation:ViewEncapsulation.None
})
export class AsciidoctorComponent implements AfterContentInit {

  private _content: string = "";
  private _asciidoctorRenderer: AsciidoctorPanelRenderer = null;

  constructor(private _elementRef: ElementRef) {
  }

  ngAfterContentInit() {
    this._asciidoctorRenderer = new AsciidoctorPanelRenderer(this._elementRef);
    this._asciidoctorRenderer.updateContent(this._content)
  }

  @Input()
  get content(): string {
    return this._content;
  }

  set content(value: string) {
    if (this._content != value) {
      this._content = value;
      if (this._asciidoctorRenderer) {
        this._asciidoctorRenderer.updateContent(this._content)
      }
    }
  }
}

class AsciidoctorPanelRenderer {

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

@NgModule({
  exports: [AsciidoctorComponent],
  declarations: [AsciidoctorComponent],
})
export class AsciidoctorPanelModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: AsciidoctorPanelModule,
    };
  }
}
