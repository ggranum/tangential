import {Injectable} from '@angular/core';

import {ObjMap} from '@tangential/core';
import {defaultUsers} from '../../../../config/common/firebase/users.local';
import {EmailPasswordCredentials} from '@tangential/authorization-service';

const userMap: ObjMap<any> = {}

defaultUsers.forEach((user: any) => {
  userMap[user.uid] = user
})

@Injectable()
export class TestConfiguration {
  adminCredentials: EmailPasswordCredentials = userMap['Administrator']
  testUserCredentials: EmailPasswordCredentials = userMap['TestUser']
}
