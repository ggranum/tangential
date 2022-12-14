import {existsSync, statSync} from 'fs';
import {series} from 'gulp';
import * as minimist from 'minimist'
import * as path from 'path'

import {execTask, collectComponents, execChildProcess} from '../../util/task_helpers';
import {DIST_LIBRARIES_ROOT} from '../../constants';
import { deleteGlob} from '../clean'
import {buildLibsRelease} from './libraries'

const argv = minimist(process.argv.slice(3));


/** Make sure we're logged in. */
function publish_whoami() {
  return execTask('npm', ['whoami'], {
    silent:     true,
    errMessage: 'You must be logged in to publish.'
  })
}

async function _execNpmPublish(componentPath: string, label: string): Promise<void> {
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
  await execChildProcess(command, args, `Component ${componentPath} did not publish.`)

}


async function publishAllLibrariesTask() {
  const mArgs = minimist(process.argv.slice(3));
  const label = mArgs['tag']
  const yesReally = mArgs['yesIReallyMeanAllLibs']
  if (!yesReally) {
    throw new Error(
      'Rarely do we want to publish all library versions at once. Please set the `yesIReallyMeanAllLibs` flag to continue.\n ' +
      'Probably you should cd into the library you made changes to and publish that on its own.')
  }
  const currentDir = process.cwd();

  let paths: string[] = collectComponents(DIST_LIBRARIES_ROOT)
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
}


export const publishAllLibs = series(publish_whoami, buildLibsRelease, publishAllLibrariesTask)
