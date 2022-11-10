import {Injectable} from '@angular/core'
import {AdminService, AuthSubject} from '@tangential/authorization-service'
import {FirebaseProvider, FireBlanket} from '@tangential/firebase-util'
import * as firebase from 'firebase'
import {TangentialPlugin} from '../plugin'
import {PluginService} from './plugin-service'

export const PluginsFirebaseRef = function (db: firebase.database.Database): firebase.database.Reference {
  return db.ref('/plugins')
}
export const PluginFirebaseRef = function (db: firebase.database.Database, pluginKey: string): firebase.database.Reference {
  return PluginsFirebaseRef(db).child(pluginKey)
}


@Injectable()
export class FirebasePluginService extends PluginService {
  private db: firebase.database.Database

  constructor(protected fb: FirebaseProvider, adminService: AdminService) {
    super(adminService)
    this.db = fb.app.database()
  }


  protected savePluginState(subject: AuthSubject, plugin: TangentialPlugin): Promise<void> {
    let ref = PluginFirebaseRef(this.db, plugin.configuration.id)
    let cfg = plugin.configuration
    return FireBlanket.set(ref,
      {
        name:       cfg.name,
        id:         cfg.id,
        installing: true
      })
  }
}
