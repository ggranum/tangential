import {existsSync, statSync} from 'fs';
import {series} from 'gulp';
import * as minimist from 'minimist'
import * as path from 'path'

import {execTask, collectComponents, execChildProcess} from '../util/task_helpers';
import {DIST_LIBRARIES_ROOT} from '../constants';
import {clean, deleteGlob} from './clean'
import {buildLibs} from './libraries'

const argv = minimist(process.argv.slice(3));

const logMessageBuffer = (data: Buffer) => {
  console.log(`stdout: ${data.toString().split(/[\n\r]/g).join('\n        ')}`);
}

export async function build_release_cleanSpec() {
  return deleteGlob('dist/**/*.spec.*')
}

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

async function publish_publish() {
  const label = argv['tag'];
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


export const build_release = series(clean, buildLibs, build_release_cleanSpec)
export const publish = series(publish_whoami, build_release, publish_publish)
