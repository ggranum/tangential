import {LIBRARY_BUILD_ORDER} from '../constants';
import * as minimist from 'minimist'
import {execNodeTask} from '../task_helpers'

const mArgs = minimist(process.argv.slice(3));


export async function buildLibsDevelopment() {
  return doBuildLibs('development')
}

buildLibsDevelopment.description = 'Build all libraries using the \'development\' configuration - shortcut for `buildLibs --configuration development`'


export async function buildLibs() {
  const configuration: string = mArgs['configuration'] || mArgs['c']
  return doBuildLibs(configuration)
}

buildLibs.description = 'Build all libraries (see constants.ts for build order list). Executes `ng build {libName}` for each library.'

async function doBuildLibs(configuration?: string) {
  for (const lib of LIBRARY_BUILD_ORDER) {
    const args: string[] = ['build', `@tangential/${lib}`]
    if (configuration) {
      args.push('--configuration');
      args.push(configuration)
    }
    await execNodeTask('@angular/cli', 'ng', args)
  }

}

