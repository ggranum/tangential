import {Injectable} from '@angular/core'
import {EmailPasswordCredentials} from '@tangential/authorization-service'

import {ObjMap} from '@tangential/core'
import {defaultUsers} from '../../config/dev/firebase/users.local'

const userMap: ObjMap<any> = {}

defaultUsers.forEach((user: any) => {
  userMap[user.uid] = user
})

@Injectable()
export class TestConfiguration {
  adminCredentials: EmailPasswordCredentials = userMap['Administrator']
  testUserCredentials: EmailPasswordCredentials = userMap['TestUser']
}
