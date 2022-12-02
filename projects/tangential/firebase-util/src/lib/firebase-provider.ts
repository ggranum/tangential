import {Injectable} from '@angular/core'

import {FirebaseApp} from '@firebase/app'
import {Database} from '@firebase/database'
import {getApp, initializeApp } from "firebase/app";
import { getDatabase } from 'firebase/database';

import {FirebaseConfig} from './firebase-config'

/**
 * With the new function route in Firebase 9, this is basically useless. Possibly worse than useless given the complications that
 * injecting multiple providers involve.
 */
@Injectable()
export class FirebaseProvider {

  public app: FirebaseApp

  constructor(private config: FirebaseConfig) {
    const name:string = 'defaultDb'

    if (!config || !config.apiKey) {
      console.log('FirebaseProvider', 'constructor', config)
      throw new Error('FirebaseProvider requires an instance of FirebaseConfig to be set as a provider in your module.')
    }
    try {
      this.app = initializeApp(config, name);
    } catch (e) {
      // re-init happens in unit tests.
      console.log("FirebaseProvider', 'Reinitializing firebase - if you're not running unit tests this is bad.")
      this.app = getApp(name)
    }
  }

  /**
   * refactoring stub so we can inline later, hopefully.
   */
  getDatabase(): Database{
    return getDatabase(this.app)
  }
}
