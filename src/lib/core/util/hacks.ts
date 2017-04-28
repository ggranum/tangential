import {ChangeDetectorRef} from '@angular/core'
export class Hacks {
  static materialDesignPlaceholderText(changeDetector: ChangeDetectorRef) {
    setTimeout(() => {
      changeDetector.markForCheck()
    }, 100)
  }
}
