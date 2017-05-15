import {Injectable} from '@angular/core';

import {ObjMap} from '@tangential/core';
import {projectUsers} from '../../../../config/users.local';
import {EmailPasswordCredentials} from '@tangential/authorization-service';

const userMap: ObjMap<any> = {}

projectUsers.dev.forEach((user: any) => {
  userMap[user.uid] = user
})

@Injectable()
export class TestConfiguration {
  adminCredentials: EmailPasswordCredentials = userMap['Administrator']
  testUserCredentials: EmailPasswordCredentials = userMap['TestUser']
}
