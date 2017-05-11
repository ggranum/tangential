import {Injectable} from '@angular/core'
import * as firebase from 'firebase'
import {FirebaseConfig} from './firebase-config'

@Injectable()
export class FirebaseProvider {

  public app: firebase.app.App

  constructor(private config: FirebaseConfig) {
    if (!config || !config.apiKey) {
      console.log('FirebaseProvider', 'constructor', config)
      throw new Error('FirebaseProvider requires an instance of FirebaseConfig to be set as a provider in your module.')
    }
    try {
      this.app = firebase.initializeApp(config)
    } catch (e) {
      // re-init happens in unit tests.
      this.app = firebase.app(null)
    }
  }
}
