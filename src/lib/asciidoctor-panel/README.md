# AsciiDoctor Panel

An Angular2 component for displaying embedded [AsciiDoctor](http://asciidoctor.org/) content.


## Installation

```shell
> npm install --save asciidoctor.js @tangential/asciidoctor-panel
```

## Dependencies

+ [Angular2 Core](https://angular.io/) 
+ [AsciiDoctor](asciidoctor.js) The [asciidoctor](https://github.com/asciidoctor/asciidoctor.js) project.


## Use

Somewhere in your code, prior to loading the Module, you will need to load the AsciiDoctor.js file:

```html


```


In your module (e.g.app.module.ts):
```javascript

// import the module
import {TanjAsciidoctorPanelModule} from '@tangential/asciidoctor-panel';

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
<mat-card>
  <tanj-asciidoctor-panel style="white-space:normal;overflow-wrap: normal;overflow: auto" [content]="asciidoctorContent"></tanj-asciidoctor-panel>
</mat-card>
```





