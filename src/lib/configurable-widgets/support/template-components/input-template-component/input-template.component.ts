import {EventEmitter} from '@angular/core'
//noinspection TypeScriptPreferShortImport
import {ConfigurableInputIval} from '../../../data-type/configurable-input-ival'
import {InputConfig} from '../../../input-config'
import {InputViewMode} from '../../input-view-mode'


export interface InputTemplateIF {
  config?: InputConfig;
  ival: ConfigurableInputIval;
  mode: InputViewMode;
  hideLabel?: boolean;
  onlyLabel?: boolean;
  change?: EventEmitter<any>
}
