import {
  Component,
  ElementRef,
  ChangeDetectionStrategy,
  Input,
  AfterContentInit,
  ViewEncapsulation,
} from '@angular/core';
import {AsciidoctorPanelRenderer} from "./asciidoctor-renderer";


@Component({
  selector: 'tg-asciidoctor-panel',
  templateUrl: 'asciidoctor-panel.component.html',
  styleUrls: ['asciidoctor-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
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

