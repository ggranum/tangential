import {Observable} from 'rxjs';
//noinspection ES6PreferShortImport
import {AuthUserDm, AuthUserKey} from '../../media-type/doc-model/auth-user';
//noinspection ES6PreferShortImport
import {AuthUser} from '../../media-type/cdm/auth-user';

export abstract class UserService {

  abstract awaitUsers$(): Observable<AuthUserDm[]>

  abstract getUserFragment(key: AuthUserKey): Promise<AuthUser>

  abstract getUser(key: AuthUserKey): Promise<AuthUser>

}


