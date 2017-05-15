import * as path from 'path';
import {task} from 'gulp';
import {Project} from './model/project';
import {Env} from '../env';


task('project:init', (done: any) => {
  let p = Project.init(path.join(Env.projectFile(), '../'))
  done()
})

task('project:update-local', (done: any) => {
  let p = Project.load(Env.projectFile())
  p.writeUserTs()
  p.writeEnvironmentTs()
  done()
})



