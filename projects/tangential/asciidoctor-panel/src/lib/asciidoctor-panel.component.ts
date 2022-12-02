import {
  Component,
  ElementRef,
  ChangeDetectionStrategy,
  Input,
  AfterContentInit,
  ViewEncapsulation,
} from '@angular/core';
import {AsciidoctorPanelRenderer} from './asciidoctor-renderer';


@Component({
  selector:        'tanj-asciidoctor-panel',
  templateUrl:     './asciidoctor-panel.component.html',
  styleUrls:       ['./asciidoctor-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation:   ViewEncapsulation.None
})
export class AsciidoctorComponent implements AfterContentInit {

  private _content: string = '';
  private asciidoctorRenderer: AsciidoctorPanelRenderer = null;

  constructor(private elementRef: ElementRef) { }

  ngAfterContentInit() {
    this.asciidoctorRenderer = new AsciidoctorPanelRenderer(this.elementRef);
    this.asciidoctorRenderer.updateContent(this._content)
  }

  @Input()
  get content(): string {
    return this._content;
  }

  set content(value: string) {
    if (this._content !== value) {
      this._content = value;
      if (this.asciidoctorRenderer) {
        this.asciidoctorRenderer.updateContent(this._content)
      }
    }
  }
}

