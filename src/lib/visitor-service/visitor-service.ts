import {Visitor} from '@tangential/visitor-service';
import {Observable} from 'rxjs/Observable';

export abstract class VisitorService {

  abstract awaitVisitor$(timeoutMils?: number): Observable<Visitor>

  abstract visitor$(): Observable<Visitor>

  abstract setVisitorPreferences(visitor: Visitor): Promise<void>

  abstract updateVisitorPreferences(visitor: Visitor): Promise<void>


}
