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
    done()
  }).catch((e: any) => {
    if (e.name == TangentialError.name) {
      console.error(e.message)
    } else {
      console.error('Unhandled Error:', e)
    }
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
    done()
  }, (e: any) => {
    console.log('Backup failed: ', e)
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
    done()
  }).catch((e: any) => {
    if (e.name == TangentialError.name) {
      console.error(e.message)
    } else {
      console.error('Unhandled Error:', e)
    }
  })
});

