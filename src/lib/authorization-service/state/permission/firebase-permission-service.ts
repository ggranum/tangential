import {AuthPermission} from "@tangential/media-types";
import {Injectable} from "@angular/core";
import {FirebaseService, FirebaseProvider} from "@tangential/firebase";
import {PermissionService} from "./permission-service";


@Injectable()
export class FirebasePermissionService extends FirebaseService<AuthPermission> implements PermissionService {

  constructor(private fb:FirebaseProvider) {
    super("/auth/permissions", fb.app.database(), (json: any, key: string) => {
      return json ? new AuthPermission(Object.assign({}, json, {$key: key})) : null
    })

  }




}
