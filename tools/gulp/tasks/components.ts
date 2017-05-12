import {task, watch} from 'gulp';
import * as path from 'path';

import {SOURCE_ROOT, DIST_COMPONENTS_ROOT, PROJECT_ROOT} from '../constants';
import {sassBuildTask, tsBuildTask, execNodeTask, copyTask} from '../task_helpers';

// No typings for this.
const inlineResources = require('../release/inline-resources');

const libDir = path.join(SOURCE_ROOT, 'lib');


task(':watch:components', () => {
  watch(path.join(libDir, '**/*.ts'), [':build:components:ts']);
  watch(path.join(libDir, '**/*.scss'), [':build:components:scss']);
  watch(path.join(libDir, '**/*.html'), [':build:components:assets']);
});


task(':build:components:ts', tsBuildTask(libDir, path.join(libDir, 'tsconfig.lib.json')));
task(':build:components:assets',
     copyTask(path.join(libDir, '*/**/*.!(ts|spec.ts)'), DIST_COMPONENTS_ROOT));
task(':build:components:scss', sassBuildTask(
  DIST_COMPONENTS_ROOT, libDir, [path.join(libDir, 'core/style')]
));

task('build:components', [
  ':build:components:ts',
  ':build:components:assets',
  ':build:components:scss'
], () => inlineResources([DIST_COMPONENTS_ROOT]));

task(':build:components:ngc', ['build:components'], execNodeTask(
  '@angular/compiler-cli', 'ngc', ['-p', path.relative(PROJECT_ROOT, libDir)]
));
