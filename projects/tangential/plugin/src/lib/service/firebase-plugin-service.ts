import {Injectable} from '@angular/core'
import {Database, DatabaseReference} from '@firebase/database'
import {AdminService, AuthSubject} from '@tangential/authorization-service'
import {FirebaseProvider, FireBlanket} from '@tangential/firebase-util'
import {child, getDatabase, ref} from 'firebase/database';

import {TangentialPlugin} from '../plugin'
import {PluginService} from './plugin-service'

export const PluginsFirebaseRef = function (db: Database): DatabaseReference {
  return ref(db, '/plugins')
}

export const PluginFirebaseRef = function (db: Database, pluginKey: string): DatabaseReference {
  return child(PluginsFirebaseRef(db), pluginKey);
}

@Injectable()
export class FirebasePluginService extends PluginService {
  private readonly db: Database

  constructor(protected fb: FirebaseProvider, adminService: AdminService) {
    super(adminService)
    this.db = getDatabase(fb.app)
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
