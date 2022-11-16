import * as child_process from 'child_process';
import * as fs from 'fs';
import * as gulp from 'gulp';
import * as gulpTs from 'gulp-typescript';
import * as path from 'path';

import {NPM_VENDOR_FILES, PROJECT_ROOT, DIST_ROOT} from './constants';
import {existsSync, readdirSync, statSync} from 'fs';
import * as merge2 from 'merge2';


/** These imports lack typings. */
const gulpClean = require('gulp-clean');
const gulpSass = require('gulp-sass');
const gulpServer = require('gulp-server-livereload');
const gulpSourcemaps = require('gulp-sourcemaps');
const resolveBin = require('resolve-bin');


/** If the string passed in is a glob, returns it, otherwise append '**\/*' to it. */
function _globify(maybeGlob: string, suffix = '**/*') {
  return maybeGlob.indexOf('*') != -1 ? maybeGlob : path.join(maybeGlob, suffix);
}

/** Create a TS Build Task, based on the options found in the specified tsconfig file. */
export function tsBuildTask(taskDir: string, tsconfigFilePath:string) {
  return () => {
    const tsConfig: any = JSON.parse(fs.readFileSync(tsconfigFilePath, 'utf-8'));
    const dest: string = path.join(taskDir, tsConfig['compilerOptions']['outDir']);

    const tsProject = gulpTs.createProject(tsconfigFilePath, {
      typescript: require('typescript')
    });

    let pipe = tsProject.src()
      .pipe(gulpSourcemaps.init())
      .pipe(tsProject(gulpTs.reporter.longReporter()));
    let dts = pipe.dts.pipe(gulp.dest(dest));

    return merge2([
      dts,
      pipe
        .pipe(gulpSourcemaps.write('.'))
        .pipe(gulp.dest(dest))
    ]);
  };
}


/** Create a SASS Build Task. */
export function sassBuildTask(dest: string, root: string, includePaths: string[]) {
  const sassOptions = {includePaths};

  return () => {
    return gulp.src(_globify(root, '**/*.scss'))
      .pipe(gulpSourcemaps.init())
      .pipe(gulpSass(sassOptions).on('error', gulpSass.logError))
      .pipe(gulpSourcemaps.write('.'))
      .pipe(gulp.dest(dest));
  };
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
  return (done: (err?: string) => void) => {
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
          done('Process failed with code ' + code);
        } else {
          done(options.errMessage);
        }
      } else {
        done();
      }
    });
  }
}

/**
 * Create a task that executes an NPM Bin, by resolving the binary path then executing it. These are
 * binaries that are normally in the `./node_modules/.bin` directory, but their name might differ
 * from the package. Examples are typescript, ngc and gulp itself.
 */
export function execNodeTask(packageName: string, executable: string | string[], args?: string[],
                             options: ExecTaskOptions = {}) {
  if (!args) {
    args = <string[]>executable;
    executable = undefined;
  }

  return (done: (err: any) => void) => {
    resolveBin(packageName, {executable: executable}, (err: any, binPath: string) => {
      if (err) {
        done(err);
      } else {
        // Forward to execTask.
        execTask(binPath, args, options)(done);
      }
    });
  }
}


/** Copy files from a glob to a destination. */
export function copyTask(srcGlobOrDir: string, outRoot: string) {
  return () => {
    return gulp.src(_globify(srcGlobOrDir)).pipe(gulp.dest(outRoot));
  }
}


/** Delete files. */
export function cleanTask(glob: string) {
  return () => gulp.src(glob, {read: false}).pipe(gulpClean(null));
}


/** Create a task that copies vendor files in the proper destination. */
export function vendorTask() {
  return () => merge2(
    NPM_VENDOR_FILES.map(root => {
      const glob = path.join(PROJECT_ROOT, 'node_modules', root, '**/*.+(js|js.map)');
      return gulp.src(glob).pipe(gulp.dest(path.join(DIST_ROOT, 'vendor', root)));
    }));
}


/** Create a task that serves the dist folder. */
export function serverTask(liveReload: boolean = true,
                           streamCallback: (stream: NodeJS.ReadWriteStream) => void = null) {
  return () => {
    const stream = gulp.src('dist').pipe(gulpServer({
      livereload: liveReload,
      fallback: 'index.html',
      port: 4200
    }));

    if (streamCallback) {
      streamCallback(stream);
    }
    return stream;
  }
}


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

export const collectComponents = function (dirPath: string): string[] {
  let componentPaths: string[] = []
  let paths: string[] = listDirectories(dirPath)
  paths.forEach((dirPath) => {
    if (pathIsComponentDir(dirPath)) {
      componentPaths.push(dirPath)
    }
  })
  return componentPaths
}
