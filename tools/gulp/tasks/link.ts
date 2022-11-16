import {spawn} from 'child_process';
import {existsSync, statSync} from 'fs';
import {series, task} from 'gulp';
import * as minimist from 'minimist'
import * as path from 'path'

import {cleanTask, collectComponents} from '../task_helpers';
import {DIST_COMPONENTS_ROOT} from '../constants';
import {clean} from './clean'
import {build_component_ngc} from './components'
import {build_release, build_release_cleanSpec} from './release'

const argv = minimist(process.argv.slice(3));

const logMessageBuffer = (data: Buffer) => {
  console.log(`stdout: ${data.toString().split(/[\n\r]/g).join('\n        ')}`);
}



function _execNpmLink(componentPath: string, unlink:boolean): Promise<void> {
  const stat = statSync(componentPath);

  if (!stat.isDirectory()) {
    return new Promise<void>(resolve => {});
  }

  if (!existsSync(path.join(componentPath, 'package.json'))) {
    console.log(`Skipping ${componentPath} as it does not have a package.json.`);
    return new Promise<void>(resolve => {});
  }

  process.chdir(componentPath);
  console.log(`Linking '${componentPath}/'...`);

  const command = 'npm';
  let args = unlink ? ['unlink'] : ['link'];
  return new Promise<void>((resolve, reject) => {
    console.log(`Executing "${command} ${args.join(' ')}"...`);
    let errMsg = ''
    const childProcess = spawn(command, args);
    childProcess.stdout.on('data', logMessageBuffer);
    childProcess.stderr.on('data', (data: Buffer) => {
      errMsg = errMsg + data.toString().split(/[\n\r]/g).join('\n        ');
    });

    childProcess.on('close', (code: number) => {
      if (code == 0) {
        resolve();
      } else {
        if(errMsg && errMsg.length){
          console.error('stderr:' + errMsg.replace('npm ERR!', ''));
        }
        reject(new Error(`Component ${componentPath} did not link, status: ${code}.`));
      }
    })
  })
}

/**
 * Publish each of the @tangential/* components, as defined in src/tsconfig.lib.json
 */
function _link() {
  const unlink = !!argv['unlink'];
  const currentDir = process.cwd();

  let paths: string[] = collectComponents(DIST_COMPONENTS_ROOT)

  // Build a promise chain that publish each component.
  paths
    .reduce((prev, dirName) => prev.then(() => _execNpmLink(dirName, unlink)), Promise.resolve())
    .catch((err: Error) => {
      console.log('Link error:', err);
      throw err;
    })
    .then(() => process.chdir(currentDir));
}

const link = series(build_release, _link);
export {link}
