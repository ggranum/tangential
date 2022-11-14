import * as gulp from 'gulp';
const gulpClean = require('gulp-clean');

/**
 * Delete all files in the /dist directory.
 * */
export function clean(cb){
  cleanTask('dist')
  cb()
}

function cleanTask(glob: string) {
  return () => gulp.src(glob, { read: false }).pipe(gulpClean(null));
}

