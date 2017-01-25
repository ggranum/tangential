# AsciiDoctor Panel

An Angular2 component for displaying embedded [AsciiDoctor](http://asciidoctor.org/) content.


## Installation

```shell
> npm install --save asciidoctorjs-web-repack @tangential/asciidoctor-panel
```

## Dependencies

+ [Angular2 Core](https://angular.io/) 
+ [AsciiDoctor Web Repack](https://www.npmjs.com/package/asciidoctorjs-web-repack) A web-packaged version of the [asciidoctor](https://github.com/asciidoctor/asciidoctor.js) project.


## Use

In your main app (e.g.app.module.ts):
```javascript

// import the module
import {AsciidoctorPanelModule} from '@tangential/asciidoctor-panel';

// and register it as an import: 
@NgModule({
  declarations: [
    AppComponent,
    ...
  ],
  imports: [
    AsciidoctorPanelModule,
    ...
  ],
  entryComponents: [AppComponent],
  bootstrap: [AppComponent]
})

```


And reference it in your component:

```html
<md-card>
  <tg-asciidoctor-panel style="white-space:normal;overflow-wrap: normal;overflow: auto" [content]="asciidoctorContent"></tg-asciidoctor-panel>
</md-card>
```





