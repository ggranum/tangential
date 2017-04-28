import {AuthUser, EmailPasswordCredentials} from '@tangential/authorization-service'
import {Visitor} from '@tangential/visitor-service'
import {Observable} from 'rxjs/Observable'

export abstract class VisitorService {

  abstract visitor$(): Observable<Visitor>

  abstract setVisitorPreferences(visitor: Visitor): Promise<void>

  abstract updateVisitorPreferences(visitor: Visitor): Promise<void>

  abstract awaitVisitor$(timeoutMils?: number): Observable<Visitor>


  abstract createUserWithEmailAndPassword(payload: EmailPasswordCredentials): Promise<Visitor>

  abstract signInWithEmailAndPassword(action: EmailPasswordCredentials): Promise<Visitor>

  abstract signInAnonymously(): Promise<Visitor>

  abstract signOut(): Promise<void>;

  abstract linkAnonymousAccount(authUser: AuthUser, newCredentials: EmailPasswordCredentials): Promise<Visitor>

}
