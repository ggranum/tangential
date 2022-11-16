import {parallel, series, task, watch} from 'gulp';
import * as path from 'path';

import {SOURCE_ROOT, DIST_COMPONENTS_ROOT, PROJECT_ROOT} from '../constants';
import {sassBuildTask, tsBuildTask, execNodeTask, copyTask, execTask} from '../task_helpers';

// No typings for this.
const inlineResources = require('../release/inline-resources');

const libDir = path.join(SOURCE_ROOT, 'lib');

export function build_component_ts(cb) {
  tsBuildTask(libDir, path.join(libDir, 'tsconfig.lib.json'))
  cb()
}

export function build_component_scss(cb) {
  sassBuildTask(DIST_COMPONENTS_ROOT, libDir, [path.join(libDir, 'core/style')])
  cb()
}

export function build_component_assets(cb) {
  copyTask(path.join(libDir, '*/**/*.!(ts|spec.ts)'), DIST_COMPONENTS_ROOT)
  cb()
}

export function watch_components(cb) {
  watch(path.join(libDir, '**/*.ts'), build_component_ts);
  watch(path.join(libDir, '**/*.scss'), build_component_scss);
  watch(path.join(libDir, '**/*.html'), build_component_assets);
  cb()
}

function build_inlineResources(cb) {
  inlineResources([DIST_COMPONENTS_ROOT]);
  cb()
}

export function build_component_ngc(cb) {
  execNodeTask(
    '@angular/compiler-cli', 'ngc', ['-p', path.relative(PROJECT_ROOT, path.join(libDir, 'tsconfig.lib.json'))]
  )
  cb()
}

const build_components = series(parallel(build_component_ts, build_component_scss, build_component_assets), build_inlineResources)
const build_ngc = series(build_components, build_component_ngc)
export {build_components, build_ngc}

