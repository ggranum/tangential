import {Injectable} from '@angular/core'
import {Observable} from 'rxjs/Observable'
//noinspection TypeScriptPreferShortImport
import {AuthDocModel} from '../../media-type/auth/auth-doc-model'
import {AuthUser} from '../../media-type/auth/auth-user'
//noinspection TypeScriptPreferShortImport
import {EmailPasswordCredentials} from '../../media-type/auth/email-password-credentials'
import {SignInState} from '../../sign-in-state'

@Injectable()
export abstract class AuthService {

  abstract authUser$(): Observable<AuthUser>

  abstract createUserWithEmailAndPassword(payload: EmailPasswordCredentials): Promise<AuthUser>

  abstract signInWithEmailAndPassword(action: EmailPasswordCredentials, suppressUserInfoSynchronization?: boolean): Promise<AuthUser>

  abstract signInAnonymously(): Promise<AuthUser>

  abstract signOut(): Promise<void>;

  abstract signInState$(): Observable<SignInState>

  abstract deleteAccount(): Promise<void>

  abstract sendResetPasswordEmail(toEmailAddress: string): Promise<void>

  abstract linkAnonymousAccount(authUser: AuthUser, newCredentials: EmailPasswordCredentials): Promise<AuthUser>

  abstract authDocumentModel$(): Observable<AuthDocModel>


}
