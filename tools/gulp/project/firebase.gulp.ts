import {task} from 'gulp';
import {Env} from '../env';
import {Project} from './model/project';
import {TangentialError} from './exception/tangential-error';

task('firebase:push-project-users', (done: any) => {
  let p = Project.load(Env.projectFile())
  let pEnv = p.currentEnvironment()
  pEnv.firebase.pushProjectUsersToRemote().then(() => {
    console.log(`Remote users pushed to firebase authentication table: `
      + `https://console.firebase.google.com/project/${pEnv.firebase.config.projectId}/authentication/users `)
  }).catch((e: any) => {
    TangentialError.handle(e)
  }).then(() => {
    done()
    process.exit(0)
  })
});

task('firebase:take-database-backup', (done: any) => {
  let p = Project.load(Env.projectFile())
  let pEnv = p.currentEnvironment()
  pEnv.firebase.takeBackupFromRemote(p.getBasePath()).then((written: boolean) => {
    if (written) {
      console.log(`Remote data was successfully backed up.`)
    } else {
      console.log(`There was no data to back up.`)
    }
  }, (e: any) => {
    TangentialError.handle(e)
  }).then(() => {
    done()
    process.exit(0)
  })
});

task('firebase:push-database-template', (done: any) => {
  let p = Project.load(Env.projectFile())
  let pEnv = p.currentEnvironment()
  pEnv.firebase.pushDatabaseTemplateToRemote(Env.force).then((written: boolean) => {
    if (written) {
      console.log(`Remote data was successfully written: `
        + `https://console.firebase.google.com/project/${pEnv.firebase.config.projectId}/database/data`)
    } else {
      console.log(`Remote data was not written. See previous log messages.`)
    }
  }).catch((e: any) => {
    TangentialError.handle(e)
  }).then(() => {
    done()
    /* There was once a time where disconnecting from firebase admin was enough to let gulp exit normally. Alas, no longer. */
    process.exit(0)
  })
});

