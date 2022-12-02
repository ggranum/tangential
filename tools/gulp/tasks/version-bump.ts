import {series} from 'gulp'
import * as minimist from 'minimist'
import * as path from 'path'
import * as jsonFile from 'jsonfile'
import {ALLOWED_PRE_RELEASE_IDENTIFIERS, LIBRARIES_ROOT, LIBRARY_BUILD_ORDER, PROJECT_ROOT, SOURCE_ROOT} from '../constants';
import {collectComponents, execChildProcess, execNodeTask} from '../util/task_helpers';
import {PackageDescriptor, NpmPackageUpdater} from '../util/package-descriptor';
import {buildLib, buildLibs} from './libraries'


/**
 * This task/class updates the library versions and publishes them.
 *
 * There is a task that publishes all the libraries at once, however it should be used extremely rarely.
 *
 */

/**
 * You can test your version updates on the command line with the semver package:
 * `npx semver 0.2.0 -i prerelease --preid beta` ==> 0.2.1-beta.0
 * `npx semver 0.2.0 -i preminor --preid beta` ==> 0.3.0-beta.0
 * `npx semver 0.3.0-beta -i prerelease --preid beta` ==> 0.3.0-beta.0
 * `npx semver 0.2.0-beta.6 -i preminor --preid beta` ==> 0.3.0-beta.0
 */
export async function doVersionBump() {
  const mArgs = minimist(process.argv.slice(3));
  const theLib = mArgs['lib']
  const increment = mArgs['i']
  const preId = mArgs['preid']
  const componentPath = `${LIBRARIES_ROOT}/${theLib}`

  if(!theLib){
    throw new Error("The library to version bump must be specified via the --lib argument.")
  }
  if(LIBRARY_BUILD_ORDER.indexOf(theLib) < 0 ){
    throw new Error(`Unknown Library '${theLib}'. See tools/gulp/constants.ts for defined libraries.`)
  }

  if(!increment){
    throw new Error("The increment value must be specified for versionBump via the -i flag. See https://docs.npmjs.com/cli/v9/commands/npm-version.")
  }

  const args: string[] = ['version', increment]
  if(preId){
    if(ALLOWED_PRE_RELEASE_IDENTIFIERS.indexOf(preId) < 0) {
      throw new Error(`PreId must be one of [${ALLOWED_PRE_RELEASE_IDENTIFIERS.join('|')}]. @see ALLOWED_PRE_RELEASE_IDENTIFIERS, in tools/gulp/constants.ts`)
    }
    args.push('--preid')
    args.push(preId)
  }

  process.chdir(componentPath);
  console.log(`Publishing '${componentPath}/'...`);
  await execChildProcess('npm', args, `version bump failed.`)
}

/**
 * Execute a build prior to bumping version, because version bump causes changes that could pollute a change list.
 */
export const versionBump = series(buildLib, doVersionBump)
versionBump.description = 'gulp versionBump --lib [lib] -i [<newversion> | major | minor | patch | premajor | preminor | prepatch | prerelease | from-git] Bump the version for host project and plugins. See npm version command or SemVer#inc'
