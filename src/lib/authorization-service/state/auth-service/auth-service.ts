import {Injectable} from '@angular/core'
import {Observable} from 'rxjs/Observable'
//noinspection TypeScriptPreferShortImport
import {AuthDocModel} from '../../media-type/auth/auth-doc-model'
import {AuthUser} from '../../media-type/auth/auth-user'
//noinspection TypeScriptPreferShortImport
import {EmailPasswordCredentials} from '../../media-type/auth/email-password-credentials'
import {SignInState} from '../../sign-in-state'
import {AuthPermission, AuthRole, AuthSubjectDocModel, UserService} from '@tangential/authorization-service';
import {SessionInfoCdm} from '../../media-type/cdm/session-info';
import {Logger, MessageBus} from '@tangential/core';

@Injectable()
export abstract class AuthService {

  constructor(protected bus: MessageBus, protected userService: UserService){}

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

  abstract addSignInEvent(subject: AuthUser): Promise<void>

  abstract obtainAcceptLanguageHeader():Promise<SessionInfoCdm>

  handleUserSignedIn(updatedSubjectInfo: AuthSubjectDocModel): Promise<AuthUser> {
    let userKey: string = updatedSubjectInfo.$key
    return this.userService.value(userKey).then((authUser) => {
      let roles: AuthRole[]
      let effectivePermissions: AuthPermission[]
      let sessionInfo: SessionInfoCdm
      Object.assign(authUser, updatedSubjectInfo)
      return Promise.all([
        this.userService.getRolesForUser(authUser).then(r => roles = r),
        this.userService.getEffectivePermissionsForUser(authUser).then(ep => effectivePermissions = ep),
        this.obtainAcceptLanguageHeader().then(info => sessionInfo = info)
      ]).then(() => {
        let populatedSubject = new AuthUser(authUser, authUser.$key, roles, effectivePermissions, sessionInfo)
        Logger.trace(this.bus, this, '#handleUserSignedIn', 'update user object', populatedSubject.email)
        populatedSubject.lastSignInMils = Date.now()
        populatedSubject.lastSignInIp = populatedSubject.$sessionInfo.ipAddress
        this.userService.update(populatedSubject).catch(e => {
          Logger.error(this.bus, this, '#updateUserAuthData', 'Could not update user data for user: ', populatedSubject.email, e)
        })
        this.addSignInEvent(populatedSubject)
        return populatedSubject
      })
    })
  }


}
