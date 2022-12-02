import {spawn} from 'child_process';
import {existsSync, statSync} from 'fs';
import {series} from 'gulp';

import * as path from 'path'
import {DIST_LIBRARIES_ROOT} from '../constants';

import {collectComponents, execChildProcess} from '../util/task_helpers';

import {build_release} from './release'

/**
 * GulpTask: link
 * NPM Link (or unlink, with the 'unlink' argument) the built libraries into the global npm 'namespace'.
 *
 * Used when the primary focus is developing an app that depends on a Tangential Library, but supporting changes
 * are required to said library.
 *
 * For example, you are developing an application that consumes the admin-console library, where you find a bug
 * in the admin-console library. By linking the tangential library projects you create a global npm install of
 * the library, which your application will then reference, allowing you to quickly test the library changes
 * in your own application.
 *
 * npx gulp link
 *
 * @see https://docs.npmjs.com/cli/v9/commands/npm-link?v=true
 *
 *
 */
/**
 * NPM Link or unlink a project into the global NPM 'namespace' for easier development.
 * @param componentPath
 * @param unlink
 */
async function _execNpmLink(componentPath: string, unlink:boolean): Promise<void> {
  const stat = statSync(componentPath);

  if (!stat.isDirectory()) {
    console.error(`Skipping ${componentPath} as it is not a directory.`);
    return Promise.resolve();
  }

  if (!existsSync(path.join(componentPath, 'package.json'))) {
    console.error(`Skipping ${componentPath} as it does not contain a package.json file.`);
    return Promise.resolve();
  }

  //  Change into the component's directory.
  process.chdir(componentPath);
  console.log(`Linking '${componentPath}/'...`);

  const command = 'npm';
  const args = unlink ? ['unlink'] : ['link'];
  await execChildProcess(command, args, `Component ${componentPath} did not ${args[0]}.`)
}



/**
 * Link or unlink each of the @tangential/* libraries, as found in /projects/tangential.
 * Note that 'dist_components_root' is the build output directory - {projectRoot}/dist/tangential.
 */
function doLink(unlink: boolean): Promise<void> {
const currentDir = process.cwd();

  let paths: string[] = collectComponents(DIST_LIBRARIES_ROOT)

  // Build a promise chain that publish each component.
  return paths
    .reduce((prev, dirName) => prev.then(() => _execNpmLink(dirName, unlink)), Promise.resolve())
    .catch((err: Error) => {
      console.log('Link error:', err);
      throw err;
    })
    .then(() => process.chdir(currentDir));
}


function _link(): Promise<void> {
  return doLink(false);
}

function _unlink(): Promise<void> {
  return doLink(true);
}
const link = series(build_release, _link);
const unlink = series(build_release, _unlink);
link.description = "NPM Link the built @Tangential libraries into the global npm 'namespace'.";
unlink.description = "NPM Unlink the built @Tangential libraries from the global npm 'namespace'.";
export {link, unlink}
