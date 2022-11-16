import {watch, series} from 'gulp';
import * as path from 'path';

import {SOURCE_ROOT, DIST_ROOT, PROJECT_ROOT, NPM_VENDOR_FILES} from '../constants';
import {
  tsBuildTask, sassBuildTask, copyTask, execNodeTask,
  vendorTask, serverTask
} from '../task_helpers';
import {clean} from './clean'
import {build_component_assets, build_component_scss, build_component_ts, watch_components} from './components'


const appDir = path.join(SOURCE_ROOT, 'e2e-app');
const outDir = DIST_ROOT;
const PROTRACTOR_CONFIG_PATH = path.join(PROJECT_ROOT, 'test/protractor.conf.js');


function build_e2e_app_vendor(cb) {
  vendorTask()
  cb()
}

/**
 * depends on [':build:components:ts']
 */
function build_e2e_app_ts(cb) {
  tsBuildTask(appDir, path.join(appDir, 'tsconfig.e2e.json'))
  cb()
}

/**
 * depends on [':build:components:scss']
 */
function build_e2e_app_scss(cb) {
  sassBuildTask(outDir, appDir, [])
  cb()
}

function build_e2e_app_assets(cb) {
  copyTask(appDir, outDir)
  cb()
}



const build_e2e_app = series(clean, build_e2e_app_vendor, build_e2e_app_ts, build_e2e_app_scss, build_e2e_app_assets)
export {build_e2e_app}

function watch_e2e_app(cb) {
  watch(path.join(appDir, '**/*.ts'), series(build_component_ts, build_e2e_app_ts))
  watch(path.join(appDir, '**/*.scss'), series(build_component_scss, build_e2e_app_scss))
  watch(path.join(appDir, '**/*.html'), series(build_component_assets, build_e2e_app_assets))
  cb()
}


function test_protractor_setup(cb) {
  execNodeTask('protractor', 'webdriver-manager', ['update'])
  cb()
}

function test_protractor(cb) {
  execNodeTask('protractor', [PROTRACTOR_CONFIG_PATH])
  cb()
}

// This task is used because, in some cases, protractor will block and not exit the process,
// causing Travis to timeout. This task should always be used in a synchronous sequence as
// the last step.
function e2e_done(cb) {
  process.exit(0)
  cb() // haha.
}

let stopE2eServer: () => void = null;

function serve_e2e_app_start(cb) {
  serverTask(false, (stream) => { stopE2eServer = () => stream.emit('kill') })
  cb()
}

function serve_e2e_app_stop(cb) {
  stopE2eServer()
  cb()
}



const serve_e2e_app = series(build_e2e_app, serve_e2e_app_start, watch_components, watch_e2e_app)
exports.watch_e2e_app = watch_e2e_app
exports.e2e = series(test_protractor_setup, serve_e2e_app, test_protractor, serve_e2e_app_stop, e2e_done)
