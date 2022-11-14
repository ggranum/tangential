import * as gulp from 'gulp'

export function help(cb){
  /**
   * Gulp specifies a multivariate return type, but the TypeScript typedef for tree.nodes() does not,
   * hence the casting to string (task + '')
   */
  const taskList = gulp.tree().nodes
    .filter(task => { let taskName = task + ''; return !taskName.startsWith('_') } )
    .filter(task => { let taskName = task + ''; return !taskName.startsWith('ci_') })
    .filter(task  => { let taskName = task + ''; return taskName != 'default' })
    .sort();

  console.log(`\nHere's a list of supported tasks:\n   `, taskList.join('\n    '));
  console.log(`\nYou're probably looking for "test" or "serve:devapp".\n\n`);
  cb()
}


