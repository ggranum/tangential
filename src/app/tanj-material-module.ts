import {NgModule} from '@angular/core'
import {
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule, MatCheckboxModule,
  MatDialogModule,
  MatIconModule,
  MatInputModule, MatListModule,
  MatRippleModule,
  MatSnackBarModule,
  MatToolbarModule,
  MatTooltipModule,
} from '@angular/material'

const MATERIAL_MODULES = [
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatDialogModule,
  MatIconModule,
  MatInputModule,
  MatRippleModule,
  MatSnackBarModule,
  MatToolbarModule,
  MatTooltipModule,
  MatListModule,
];

@NgModule({
  imports: MATERIAL_MODULES,
  exports: MATERIAL_MODULES,
})
export class TanjMaterialModule {

}
