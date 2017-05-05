import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
//noinspection TypeScriptPreferShortImport
import {AuthDm} from '../../media-type/doc-model/auth';
//noinspection TypeScriptPreferShortImport
import {EmailPasswordCredentials} from '../../media-type/doc-model/email-password-credentials';
import {SignInState} from '../../sign-in-state';
import {AuthSubject} from '../../media-type/cdm/auth-subject';
import {UserService} from '../user/user-service';
import {SessionInfoCdm} from '../../media-type/cdm/session-info';
import {MessageBus} from '@tangential/core';
import {Auth} from '../../media-type/cdm/auth';
//noinspection TypeScriptPreferShortImport

@Injectable()
export abstract class AuthService {

  constructor(protected bus: MessageBus, protected userService: UserService) {
  }

  abstract authSubject$(): Observable<AuthSubject>

  abstract awaitKnownAuthSubject$(): Observable<AuthSubject>

  abstract createUserWithEmailAndPassword(payload: EmailPasswordCredentials): Promise<void>

  abstract signInWithEmailAndPassword(action: EmailPasswordCredentials, suppressUserInfoSynchronization?: boolean): Promise<void>

  abstract signInAnonymously(): Promise<void>

  abstract signOut(): Promise<void>;

  abstract deleteAccount(): Promise<void>

  abstract sendResetPasswordEmail(toEmailAddress: string): Promise<void>

  abstract linkAnonymousAccount(newCredentials: EmailPasswordCredentials): Promise<void>

  abstract authDocumentModel$(): Observable<AuthDm>

  abstract authSettings$(): Observable<Auth>

  abstract addSignInEvent(subject: AuthSubject): Promise<void>

  abstract obtainAcceptLanguageHeader(): Promise<SessionInfoCdm>


}
