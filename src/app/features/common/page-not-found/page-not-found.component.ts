import {ChangeDetectionStrategy, Component, HostBinding, ViewEncapsulation} from '@angular/core'
@Component({
  selector: 'tanj-page-not-found',
  template: `
              <div>Page Not Found</div>`,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PageNotFoundComponent {


}
