import * as minimist from 'minimist'
import * as path from 'path'
import * as jsonFile from 'jsonfile'


import {PROJECT_ROOT, SOURCE_ROOT} from '../constants';
import {collectComponents} from '../task_helpers';
import {PackageDescriptor, NpmPackageUpdater} from '../package-descriptor';

const argv = minimist(process.argv.slice(3));

/**
 * Loop through the provided paths (most of which are in src/lib) and update the package.json
 * with the latest version specified by 'bump' and 'qualifier'.
 * @param paths
 * @param bump
 * @param qualifier
 */
const versionBumpPaths = function (paths: string[], bump: any, qualifier: string) {

  let modules: { [key: string]: PackageDescriptor } = {}
  paths.forEach((componentPath: string) => {
    let module: PackageDescriptor = readNpmPackageDescriptor(componentPath)
    modules[module.name] = module
  })

  let rootModule = readNpmPackageDescriptor(PROJECT_ROOT)

  let maker: NpmPackageUpdater = new NpmPackageUpdater(rootModule, modules, bump, qualifier)
  let pluginDescriptors = maker.updatePlugins()

  Object.keys(pluginDescriptors).forEach((key: string) => {
    writeNpmPackageDescriptor(pluginDescriptors[key])
  })

  return writeNpmPackageDescriptor(maker.updatedHostPackage())
};

function readNpmPackageDescriptor(componentPath: string): PackageDescriptor {
  let filePath = path.join(componentPath, 'package.json')
  let module: PackageDescriptor = jsonFile.readFileSync(filePath)
  module.filePath = filePath

  return module
}

function writeNpmPackageDescriptor(module: PackageDescriptor): void {
  let path = module.filePath
  delete module.filePath
  jsonFile.writeFileSync(path, module, {spaces: 2})
}


// noinspection JSUnusedGlobalSymbols
/**
 * See https://www.npmjs.com/package/semver
 *
 * We limit --preid to 'beta', 'alpha' and 'rc' because that's our standard, so versionBump only takes a --beta / --alpha flags instead
 * of allowing the preid to be specified directly.
 *
 * You can test your version updates on the command line with the semver package:
 * `npx semver 0.2.0 -i prerelease --preid beta` ==> 0.2.1-beta.0
 * `npx semver 0.2.0 -i preminor --preid beta` ==> 0.3.0-beta.0
 * `npx semver 0.3.0-beta -i prerelease --preid beta` ==> 0.3.0-beta.0
 * `npx semver 0.2.0-beta.6 -i preminor --preid beta` ==> 0.3.0-beta.0
 *
 *
 *
 * This task is purely synchronous. Gulp requires some form of completion notification beyond a simple return.
 * Capturing this link here:
 * https://stackoverflow.com/questions/18875674/whats-the-difference-between-dependencies-devdependencies-and-peerdependencies
 */
export async function versionBump(): Promise<void> {
  const bump = argv['bump'];
  const beta = argv['beta'];
  const alpha = argv['alpha'];
  const rc = argv['rc'];
  let qualifier: string
  if (alpha) {
    qualifier = 'alpha'
  } else if (beta) {
    qualifier = 'beta'
  } else if (rc) {
    qualifier = 'rc'
  } else {
    qualifier = null
  }

  if (!bump) {
    console.log(
      'You can specify a bump level with --bump=[<newversion> | major | minor | patch | premajor | preminor | prepatch | prerelease | from-git].');
    console.log('Publishing using \'patch\'.');
  } else {
    console.log(`Publishing using the ${bump} tag.`);
  }

  if (!beta && !alpha && !rc) {
    console.log('You can add a version qualifier with \'--bump=prerelease --[alpha|beta|rc]\'.');
  } else if (bump.substring(0,3) != 'pre') {
    throw new Error(`Qualifier '${qualifier}' only applies to '--bump=[premajor|preminor|prepatch|prerelease]`)
  }

  let paths: string[] = collectComponents(SOURCE_ROOT)
  paths.sort()
  versionBumpPaths(paths, bump, qualifier);
}

(versionBump as any).description = 'Bump the version for host project and plugins. See npm version command or SemVer#inc'
