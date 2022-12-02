import * as child_process from 'child_process';
import * as gulp from 'gulp';
import * as path from 'path';

import {NPM_VENDOR_FILES, PROJECT_ROOT, DIST_ROOT} from './constants';
import {existsSync, readdirSync, statSync} from 'fs';
import * as merge2 from 'merge2';


import * as resolveBin  from 'resolve-bin'


/** If the string passed in is a glob, returns it, otherwise append '**\/*' to it. */
function _globify(maybeGlob: string, suffix = '**/*') {
  return maybeGlob.indexOf('*') != -1 ? maybeGlob : path.join(maybeGlob, suffix);
}

/** Options that can be passed to execTask or execNodeTask. */
export interface ExecTaskOptions {
  // Whether to output to STDERR and STDOUT.
  silent?: boolean;
  // If an error happens, this will replace the standard error.
  errMessage?: string;
}

/** Create a task that executes a binary as if from the command line. */
export function execTask(binPath: string, args: string[], options: ExecTaskOptions = {}, spawnOpts={}) {
  return new Promise<void>((resolve, reject) => {
    const childProcess = child_process.spawn(binPath, args, spawnOpts);

    if (!options.silent) {
      childProcess.stdout.on('data', (data: string) => {
        process.stdout.write(data);
      });

      childProcess.stderr.on('data', (data: string) => {
        process.stderr.write(data);
      });
    }

    childProcess.on('close', (code: number) => {
      if (code != 0) {
        if (options.errMessage === undefined) {
          reject(new Error('Process failed with code ' + code));
        } else {
          reject(options.errMessage);
        }
      } else {
        resolve();
      }
    });
  })
}

/**
 * Create a promise that executes an NPM Bin, by resolving the binary path then executing it. These are
 * binaries that are normally in the `./node_modules/.bin` directory, but their name might differ
 * from the package. Examples are typescript, ngc and gulp itself.
 */
export function execNodeTask(packageName: string, executable: string | string[], args?: string[],
                             options: ExecTaskOptions = {}):Promise<void> {
  if (!args) {
    args = <string[]>executable;
    executable = undefined;
  }

  return new Promise((resolve, reject) => {
    resolveBin(packageName, {executable: executable}, (err: any, binPath: string) => {
      if (err) {
        console.error(`Error running ${packageName}:${executable} using binPath ${binPath}`)
        reject(new Error(err));
      } else {
        // Forward to execTask.
        execTask(binPath, args, options).then(resolve);
      }
    });
  })
}


/** Copy files from a glob to a destination. */
export function copyTask(srcGlobOrDir: string, outRoot: string): Promise<void> {
  return new Promise((resolve, reject) => {
    let stream = gulp.src(_globify(srcGlobOrDir)).pipe(gulp.dest(outRoot))
    stream.on("finish", resolve)
    stream.on("error", reject)
  })
}

/** Create a task that copies vendor files in the proper destination. */
export function vendorTask() {
  return () => merge2(
    NPM_VENDOR_FILES.map(root => {
      const glob = path.join(PROJECT_ROOT, 'node_modules', root, '**/*.+(js|js.map)');
      return gulp.src(glob).pipe(gulp.dest(path.join(DIST_ROOT, 'vendor', root)));
    }));
}

/**
 * Provides a list of all subdirectories of the provided dirPath that do not contain a 'node_modules' child directory.
 * @param dirPath
 */
export const listDirectories = function (dirPath: string): string[] {
  let dirs: string[] = []
  let childPaths: string[] = readdirSync(dirPath)
  childPaths.forEach((childName) => {
    if (childName != 'node_modules') {
      const childPath = path.join(dirPath, childName);
      const stat = statSync(childPath);
      if (stat.isDirectory()) {
        dirs.push(childPath)
        dirs = dirs.concat(listDirectories(childPath))
      }
    }
  })
  return dirs
}

export const pathIsComponentDir = function (filePath: string) {
  let file = path.join(filePath, 'package.json')
  return existsSync(file)
}

/**
 * Starting at `dirPath`, find child directories that contain a `package.json` file
 * and add the path to the returned array.
 * @param dirPath
 */
export function collectComponents(dirPath: string): string[] {
  let componentPaths: string[] = []
  let paths: string[] = listDirectories(dirPath)
  paths.forEach((dirPath) => {
    if (pathIsComponentDir(dirPath)) {
      componentPaths.push(dirPath)
    }
  })
  return componentPaths
}
