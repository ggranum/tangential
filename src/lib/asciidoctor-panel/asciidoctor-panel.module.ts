import 'asciidoctorjs-web-repack/asciidoctor-all.min'
import {NgModule} from "@angular/core";
import {AsciidoctorComponent} from "./asciidoctor-panel.component";


@NgModule({
  declarations: [AsciidoctorComponent],
  exports: [AsciidoctorComponent],
})
export class AsciidoctorPanelModule {

}
