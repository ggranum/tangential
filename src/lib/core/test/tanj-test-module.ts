import {inject} from '@angular/core/testing';


export class TanjTestModule {


  static asTest(Module:any, key:string):[string, (done?:()=>void)=>void] {
    let testFn = function(done) {
      inject([Module], (moduleInstance) => {
        moduleInstance[key](done)
      })()
    }
    return [Module.tests[key], testFn]
  }


}
