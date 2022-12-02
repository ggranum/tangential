import {series} from 'gulp'
import {execNodeTask} from '../util/task_helpers';
import {build_release} from './release'

// depends on ['build:release']
function madge(cb) {
  execNodeTask('madge', ['--circular', './dist'])
  cb()
}

function stylelint(cb) {
  execNodeTask('stylelint', ['src/**/*.scss', '--config', 'stylelint-config.json', '--syntax', 'scss'])
  cb()
}

function tslint(cb) {
  execNodeTask('tslint', ['-c', 'tslint.json', 'src/**/*.ts'])
  cb()
}


export const lint = series(tslint, stylelint, series(build_release, madge))
