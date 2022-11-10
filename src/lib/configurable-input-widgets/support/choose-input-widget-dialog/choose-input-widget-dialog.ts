import {Component, HostBinding, ViewEncapsulation} from '@angular/core'
import {MatDialogRef} from '@angular/material'
import {BehaviorSubject} from 'rxjs'
import {debounceTime} from 'rxjs/operators'
import {InputRegistry} from '../input-types-registry'
import {InputViewModes} from '../input-view-mode'
//noinspection TypeScriptPreferShortImport
import {InputTemplateIF} from '../template-components/input-template-component/input-template.component'


@Component({
  selector:      'choose-input-widget-dialog',
  templateUrl:   './choose-input-widget-dialog.html',
  encapsulation: ViewEncapsulation.None
})
export class ChooseInputWidgetDialog {

  @HostBinding('attr.layout') flexL = 'column'
  @HostBinding('attr.layout-align') flexLA = 'start'
  @HostBinding('style.height') _height = '100%'
  @HostBinding('style.width') _width: string = '100%'
  @HostBinding('style.max-width') mw = '100%'


  templates: InputTemplateIF[] = []
  filteredTemplates: InputTemplateIF[] = []
  filterSubject: BehaviorSubject<string> = new BehaviorSubject('')

  constructor(private _registry: InputRegistry, public dialogRef: MatDialogRef<ChooseInputWidgetDialog>) {

    this.templates = this._registry.allTemplates(InputViewModes.EDIT).map((template) => {
      template.config = template.config.getDemoInstance()
      return template
    })
    this.filteredTemplates = this.templates
    this.filterSubject = new BehaviorSubject('')
    this.filterSubject.pipe(debounceTime(100)).subscribe((filterText: string) => {
      this._filterWidgets(filterText);
    })
  }

  private _filterWidgets(filterText: string) {
    if (filterText === '') {
      this.filteredTemplates = this.templates;
    } else {
      this.filteredTemplates = this.templates.filter((template) => {
        return template.config._inputName.toLowerCase().indexOf(filterText.toLowerCase()) > -1
      })
    }
  }

  onFilterTextChange(filter: string) {
    this.filterSubject.next(filter)
  }

  onWidgetClicked(inputTemplate: InputTemplateIF) {
    this.dialogRef.close(inputTemplate)
  }
}
