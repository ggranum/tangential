import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
//noinspection TypeScriptPreferShortImport
import {EmailPasswordCredentials} from '../../media-type/doc-model/email-password-credentials';
import {AuthSubject} from '../../media-type/cdm/auth-subject';
//noinspection TypeScriptPreferShortImport
import {SessionInfoCdm} from '../../media-type/cdm/session-info';
//noinspection TypeScriptPreferShortImport

@Injectable()
export abstract class AuthenticationService {

  abstract authSubject$(): Observable<AuthSubject>

  abstract awaitKnownAuthSubject$(): Observable<AuthSubject>

  abstract createUserWithEmailAndPassword(payload: EmailPasswordCredentials): Promise<void>

  abstract signInWithEmailAndPassword(action: EmailPasswordCredentials, suppressUserInfoSynchronization?: boolean): Promise<void>

  abstract signInAnonymously(): Promise<void>

  abstract signOut(): Promise<void>;

  abstract deleteAccount(): Promise<void>

  abstract sendResetPasswordEmail(toEmailAddress: string): Promise<void>

  abstract linkAnonymousAccount(newCredentials: EmailPasswordCredentials): Promise<void>

  abstract addSignInEvent(subject: AuthSubject): Promise<void>

  abstract obtainAcceptLanguageHeader(): Promise<SessionInfoCdm>


}
