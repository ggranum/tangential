import {Observable} from "rxjs";
import {AuthUser, EmailPasswordCredentials, AuthPermission, AuthRole} from "@tangential/media-types";
import {Injectable} from "@angular/core";
import {SignInState} from "@tangential/authorization-service";

@Injectable()
export abstract class VisitorService {

  redirectUrl: string
  abstract createUserWithEmailAndPassword(payload: EmailPasswordCredentials): Promise<AuthUser>
  abstract signOnObserver() : Observable<AuthUser>
  abstract signInWithEmailAndPassword(action: EmailPasswordCredentials, suppressUserInfoSynchronization?: boolean): Promise<AuthUser>
  abstract signInAnonymously(): Promise<AuthUser>
  abstract signOut(): Promise<void>;
  abstract signInState$(): Observable<SignInState>
  abstract signInState(): SignInState
  abstract isVisitorSignedIn(): boolean
  abstract deleteAccount(): Promise<void>

  abstract getEffectivePermissions():Promise<AuthPermission[]>
  abstract getGrantedPermissions():Promise<AuthPermission[]>
  abstract getRoles():Promise<AuthRole[]>
}
