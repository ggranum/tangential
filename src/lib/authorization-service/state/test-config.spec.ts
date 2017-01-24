import {Injectable} from "@angular/core";
import {EmailPasswordCredentials} from "@tangential/media-types";

import {defaultUsers} from '../config/users.local'
import {ObjMap} from "@tangential/common";

let userMap: ObjMap<any> = {}

defaultUsers.forEach((user: any) => {
  userMap[user.uid] = user
})

@Injectable()
export class TestConfiguration {
  adminCredentials: EmailPasswordCredentials = userMap['Administrator']
  testUserCredentials: EmailPasswordCredentials = userMap['TestUser']
}
