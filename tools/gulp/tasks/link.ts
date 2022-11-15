import {spawn} from 'child_process';
import {existsSync, statSync} from 'fs';
import {task} from 'gulp';
import gulpRunSequence = require('run-sequence');
import path = require('path');
import minimist = require('minimist');

import {cleanTask, collectComponents} from '../task_helpers';
import {DIST_COMPONENTS_ROOT} from '../constants';

const argv = minimist(process.argv.slice(3));

const logMessageBuffer = (data: Buffer) => {
  console.log(`stdout: ${data.toString().split(/[\n\r]/g).join('\n        ')}`);
}


task(':build:release:clean-spec', cleanTask('dist/**/*.spec.*'));


task('build:release', function(done: () => void) {
  // Synchronously run those tasks.
  gulpRunSequence(
    'clean',
    ':build:components:ngc',
    ':build:release:clean-spec',
    done
  );
});




function _execNpmLink(componentPath: string, unlink:boolean): Promise<void> {
  const stat = statSync(componentPath);

  if (!stat.isDirectory()) {
    return;
  }

  if (!existsSync(path.join(componentPath, 'package.json'))) {
    console.log(`Skipping ${componentPath} as it does not have a package.json.`);
    return;
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
task(':link', function(done: (err?: any) => void) {
  const unlink = !!argv['unlink'];
  const currentDir = process.cwd();

  let paths: string[] = collectComponents(DIST_COMPONENTS_ROOT)

  // Build a promise chain that publish each component.
  paths
    .reduce((prev, dirName) => prev.then(() => _execNpmLink(dirName, unlink)), Promise.resolve())
    .then(() => done())
    .catch((err: Error) => done(err))
    .then(() => process.chdir(currentDir));
});

task('link', function(done: () => void) {
  gulpRunSequence(
    'build:release',
    ':link',
    done
  );
});
