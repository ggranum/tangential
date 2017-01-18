import {Observable} from "rxjs";
import {AuthUserIF, AuthUser, EmailPasswordCredentials} from "@tangential/media-types";
import {Injectable} from "@angular/core";
import {SignInState} from "@tangential/authorization-service";

export interface UserAuthTokenIF {
  uid: string;
  auth: AuthUserIF
  expires?: number;
  anonymous?: boolean;
}


/**
 * CIF ==> Class-based-interface. Typescript allows implementing (instead of extending) classes. See use in
 * CachingAuthorizationService.
 */
@Injectable()
export abstract class VisitorService {

  abstract createUserWithEmailAndPassword(payload: EmailPasswordCredentials): Promise<AuthUser>
  abstract signOnObserver() : Observable<AuthUser>
  abstract signInWithEmailAndPassword(action: EmailPasswordCredentials, suppressUserInfoSynchronization?: boolean): Promise<AuthUser>
  abstract signInAnonymously(): Promise<AuthUser>
  abstract signOut(): Promise<void>;
  abstract signInState$(): Observable<SignInState>
  abstract signInState(): SignInState
  abstract deleteAccount(): Promise<void>
}
