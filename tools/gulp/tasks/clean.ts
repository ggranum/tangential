import {
  task,
} from 'gulp';
import * as gulp from 'gulp';
const gulpClean = require('gulp-clean');

/**
 * Delete all files in the /dist directory.
 * */


task('clean', cleanTask('dist'));



export function cleanTask(glob: string) {
  return () => gulp.src(glob, { read: false }).pipe(gulpClean(null));
}
