import * as path from 'path';
import {task} from 'gulp';
import {Project} from './model/project';
import {Env} from '../util/env';
import {TangentialError} from './exception/tangential-error';


task('project:init', (done: any) => {
  try {
    let p = Project.init(path.join(Env.projectFile(), '../'))
  } catch (e) {
    TangentialError.handle(e)
  }
  done()
})

task('project:update-local', (done: any) => {
  try {
    let p = Project.load(Env.projectFile())
    p.updateLocal()
  } catch (e) {
    TangentialError.handle(e)
  }
  done()
})

task('project:validate', (done: any) => {
  let p = Project.load(Env.projectFile())
  try {
    p.validate()
  } catch (e) {
    TangentialError.handle(e)
  }
  done()
})



