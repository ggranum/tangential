import {parallel, series, task, watch} from 'gulp';
import * as path from 'path';

import {SOURCE_ROOT, DIST_COMPONENTS_ROOT, PROJECT_ROOT} from '../constants';
import {sassBuildTask, tsBuildTask, execNodeTask, copyTask, execTask} from '../task_helpers';

// No typings for this.
const inlineResources = require('../release/inline-resources');

const libDir = path.join(SOURCE_ROOT, 'lib');

export function build_components_ts(cb) {
  tsBuildTask(libDir, path.join(libDir, 'tsconfig.lib.json'))
  cb()
}

export function build_components_scss(cb) {
  sassBuildTask(DIST_COMPONENTS_ROOT, libDir, [path.join(libDir, 'core/style')])
  cb()
}

export function build_component_assets(cb) {
  copyTask(path.join(libDir, '*/**/*.!(ts|spec.ts)'), DIST_COMPONENTS_ROOT)
  cb()
}

export function watch_components(cb) {
  watch(path.join(libDir, '**/*.ts'), build_components_ts);
  watch(path.join(libDir, '**/*.scss'), build_components_scss);
  watch(path.join(libDir, '**/*.html'), build_component_assets);
  cb()
}

function build_inlineResources(cb) {
  inlineResources([DIST_COMPONENTS_ROOT]);
  cb()
}

export function build_ngc(cb) {
  execNodeTask(
    '@angular/compiler-cli', 'ngc', ['-p', path.relative(PROJECT_ROOT, path.join(libDir, 'tsconfig.lib.json'))]
  )
  cb()
}

exports.build_ts = build_components_ts
exports.build_scss = build_components_scss
exports.build_assets = build_component_assets
const build_components = series(parallel(build_components_ts, build_components_scss, build_component_assets), build_inlineResources)
exports.build_components = build_components
exports.build_ngc = series(build_components, build_ngc)
exports.watch_components = watch_components
