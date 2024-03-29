import {copyAssets} from '@angular-devkit/build-angular/src/utils/copy-assets'
import {series} from 'gulp'
import {join} from 'path'
import {DIST_LIBRARIES_ROOT, LIBRARIES_ROOT, LIBRARY_BUILD_ORDER} from '../../constants';
import * as minimist from 'minimist'
import {copyTask, execNodeTask} from '../../util/task_helpers'
import {clean, deleteGlob} from '../clean'

export async function buildLibsDevelopment() {
  return doBuildLibs('development')
}
buildLibsDevelopment.description = 'Build all libraries using the \'development\' configuration - shortcut for `buildLibs --configuration development`'


export async function buildLib() {
  const mArgs = minimist(process.argv.slice(3));
  const lib = mArgs['lib']
  const configuration: string = mArgs['configuration'] || mArgs['c']
  await doBuildLib(lib, configuration)
}
buildLib.description = 'gulp buildLib --lib [lib]. Build the specified library. See constants.ts for build order list). Executes `ng build {libName}`'

export async function buildLibs() {
  const mArgs = minimist(process.argv.slice(3));
  const configuration: string = mArgs['configuration'] || mArgs['c']
  return doBuildLibs(configuration)
}
buildLibs.description = 'Build all libraries (see constants.ts for build order list). Executes `ng build {libName}` for each library.'


async function copyLibraryAssetsToBuildDir(lib: string) {
  const srcPath = join(LIBRARIES_ROOT, lib)
  const destPath = join(DIST_LIBRARIES_ROOT, lib)
  await copyTask(srcPath + '/**/*+(.md|.css|.scss|.sass|.png|.gif|.ico)', destPath)
}

export async function doBuildLib(lib: string, configuration?: string) {
  const args: string[] = ['build', `@tangential/${lib}`]
  if (configuration) {
    args.push('--configuration');
    args.push(configuration)
  }
  await execNodeTask('@angular/cli', 'ng', args)
  await copyLibraryAssetsToBuildDir(lib)
}

export async function doBuildLibs(configuration?: string) {
  for (const lib of LIBRARY_BUILD_ORDER) {
    await doBuildLib(lib, configuration)
  }
}


async function deleteSpecsFromBuildOutput() {
  return deleteGlob('dist/**/*.spec.*')
}

export const buildLibsRelease = series(clean, buildLibs, deleteSpecsFromBuildOutput)

