import {spawn} from 'child_process';
import {existsSync, readdirSync, statSync} from 'fs';
import {task} from 'gulp';
import gulpRunSequence = require('run-sequence');
import path = require('path');
import minimist = require('minimist');

import {execTask, cleanTask, collectComponents} from '../task_helpers';
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


/** Make sure we're logged in. */
task(':publish:whoami', execTask('npm', ['whoami'], {
  silent: true,
  errMessage: 'You must be logged in to publish.'
}));

task(':publish:logout', execTask('npm', ['logout']));


function _execNpmPublish(componentPath: string, label: string): Promise<void> {
  const stat = statSync(componentPath);

  if (!stat.isDirectory()) {
    return;
  }

  if (!existsSync(path.join(componentPath, 'package.json'))) {
    console.log(`Skipping ${componentPath} as it does not have a package.json.`);
    return;
  }

  process.chdir(componentPath);
  console.log(`Publishing '${componentPath}/'...`);

  const command = 'npm';
  let args = ['publish', '--access', 'public'];
  if(label){
    args.push('--tag');
    args.push(label);
  }
  return new Promise((resolve, reject) => {
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
        reject(new Error(`Component ${componentPath} did not publish, status: ${code}.`));
      }
    });
  });
}

task(':publish', function(done: (err?: any) => void) {
  const label = argv['tag'];
  const currentDir = process.cwd();

  let paths: string[] = collectComponents(DIST_COMPONENTS_ROOT)
  console.log('paths', paths)
  if (!label) {
    console.log('You can use a label with --tag=labelName.');
    console.log('Publishing using the latest tag:', JSON.stringify(paths));
  } else {
    console.log(`Publishing using the ${label} tag,`, JSON.stringify(paths));
  }
  console.log('\n\n');


  // Build a promise chain that publish each component.
  paths
    .reduce((prev, dirName) => prev.then(() => _execNpmPublish(dirName, label)), Promise.resolve())
    .then(() => done())
    .catch((err: Error) => done(err))
    .then(() => process.chdir(currentDir));
});

task('publish', function(done: () => void) {
  gulpRunSequence(
    ':publish:whoami',
    'build:release',
    ':publish',
    ':publish:logout',
    done
  );
});
