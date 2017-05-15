import {NgModule} from '@angular/core'
import {
  MdButtonModule,
  MdButtonToggleModule,
  MdCardModule,
  MdDialogModule,
  MdIconModule,
  MdInputModule,
  MdRippleModule,
  MdSnackBarModule,
  MdToolbarModule,
  MdTooltipModule
} from '@angular/material'

const MATERIAL_MODULES = [
  MdButtonModule,
  MdButtonToggleModule,
  MdCardModule,
  MdDialogModule,
  MdIconModule,
  MdInputModule,
  MdRippleModule,
  MdSnackBarModule,
  MdToolbarModule,
  MdTooltipModule,
];

@NgModule({
  imports: MATERIAL_MODULES,
  exports: MATERIAL_MODULES,
})
export class TanjMaterialModule {

}
