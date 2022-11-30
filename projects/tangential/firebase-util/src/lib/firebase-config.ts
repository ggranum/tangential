import {Injectable} from '@angular/core'

/**
 *  @todo: Maybe instantiate this via the config object that we inject?
 *  This can't be an interface because of inject, but we never new it up (it's treated as an interface basically)
 */
@Injectable()
export class FirebaseConfig {
  apiKey: string = ''
  authDomain: string = ''
  databaseURL: string = ''
  storageBucket: string = ''
}
