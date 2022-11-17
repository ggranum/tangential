import {spawn} from 'child_process';
import {existsSync, statSync} from 'fs';
import {series, task} from 'gulp';
import * as minimist from 'minimist'
import * as path from 'path'

import {execTask, collectComponents} from '../task_helpers';
import {DIST_COMPONENTS_ROOT} from '../constants';
import {clean, cleanTask} from './clean'
import { build_ngc} from './components'

const argv = minimist(process.argv.slice(3));

const logMessageBuffer = (data: Buffer) => {
  console.log(`stdout: ${data.toString().split(/[\n\r]/g).join('\n        ')}`);
}

export async function build_release_cleanSpec() {
  return cleanTask('dist/**/*.spec.*')
}

/** Make sure we're logged in. */
function publish_whoami() {
  return execTask('npm', ['whoami'], {
    silent:     true,
    errMessage: 'You must be logged in to publish.'
  })
}

function _execNpmPublish(componentPath: string, label: string): Promise<void> {
  const stat = statSync(componentPath);

  if (!stat.isDirectory()) {
    console.log(`Skipping ${componentPath} as it is not a directory.`);
    return Promise.resolve()
  }

  if (!existsSync(path.join(componentPath, 'package.json'))) {
    console.log(`Skipping ${componentPath} as it does not have a package.json.`);
    return Promise.resolve()
  }

  process.chdir(componentPath);
  console.log(`Publishing '${componentPath}/'...`);

  const command = 'npm';
  let args = ['publish', '--access', 'public'];
  if (label) {
    args.push('--tag');
    args.push(label);
  }
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
        if (errMsg && errMsg.length) {
          console.error('stderr:' + errMsg.replace('npm ERR!', ''));
        }
        reject(`Component ${componentPath} did not publish, status: ${code}.`);
      }
    })
  })
}

async function publish_publish() {
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

  const errors = []

  for (const path of paths) {
    try {
      await _execNpmPublish(path, label)
    } catch (e) {
      errors.push(e)
    }
  }

  process.chdir(currentDir)
  if(errors.length){
    throw new Error(errors.join("\n"))
  }

  // Build a promise chain that publish each component.
  return paths.reduce((prev, dirName) => {
      // return a promise so we can chain it all up. Should really use async and capture all the errors in a map which we throw
    // at end
      return prev.then(() => _execNpmPublish(dirName, label))
    }, Promise.resolve())
}


export const build_release = series(clean, build_ngc, build_release_cleanSpec)
exports.publish = series(publish_whoami, build_release, publish_publish)
