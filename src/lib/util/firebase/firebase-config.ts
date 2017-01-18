import {Injectable} from "@angular/core";

@Injectable()
export class FirebaseConfig {
  apiKey: string
  authDomain: string
  databaseURL: string
  storageBucket: string
}
