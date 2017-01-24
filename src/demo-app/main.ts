import '../polyfills.ts';
import 'hammerjs'

import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {DemoAppModule} from './demo-app-module';

platformBrowserDynamic().bootstrapModule(DemoAppModule);
