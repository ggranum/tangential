import fs = require('fs');
import {task} from 'gulp';
import {firebaseEnv} from './firebase-env';
import crypto = require('crypto')
import minimist = require('minimist')
import {Env} from '../env';
const readline = require('readline');


/**
 *
 */
task('firebase:init-local-config', (done: any) => {
  firebaseEnv.initProject().then(() => done())
})


task('firebase:create-project-users', (done: any) => {
  firebaseEnv.populateProjectUsers(true)
  done()
})


task('firebase:push-project-users', (done: any) => {
  firebaseEnv.pushProjectUsersToRemote().then(() => {
    console.log(`Remote users pushed to firebase authentication table: https://console.firebase.google.com/project/${firebaseEnv.projectId}/authentication/users `)
    done()
  }, (e: any) => {
    console.log('error', e)
  })
});

task('firebase:take-database-backup', (done: any) => {
  firebaseEnv.takeBackup().then((written: boolean) => {
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
  firebaseEnv.pushDatabaseTemplate(Env.force).then((written: boolean) => {
    if (written) {
      console.log(`Remote data was successfully written: https://console.firebase.google.com/project/${firebaseEnv.projectId}/database/data`)
    } else {
      console.log(`Remote data was not written. See previous log messages.`)
    }
    done()
  }).catch((e: any) => {
    console.log('error', e)
  })
});

