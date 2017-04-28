import {ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'tanj-page-body',
  template: `
    <div *ngIf="!suppressHeaderShim" class="tanj-header-shim"></div>
    <div [attr.flex]="flex ? true : null" [attr.layout]="layout" [attr.layout-align]="layoutAlign">
      <ng-content></ng-content>
    </div>`,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PageBodyComponent implements OnInit, OnDestroy {

  @Input() suppressHeaderShim: boolean = false
  @Input() flex: boolean = true
  @Input() layout: string = 'column'
  @Input() layoutAlign: string = 'start'

  constructor() {
  }

  ngOnDestroy() {

  }

  ngOnInit() {

  }

  sendStandardNotifications() {

  }


}



