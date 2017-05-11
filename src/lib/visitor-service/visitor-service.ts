import {Visitor} from './media-type/cdm/visitor';
//noinspection TypeScriptPreferShortImport
import {VisitorPreferences} from './media-type/cdm/visitor-preferences';

import {Observable} from 'rxjs/Observable';
import {AuthUserKey} from '@tangential/authorization-service';

export abstract class VisitorService {

  abstract awaitVisitor$(timeoutMils?: number): Observable<Visitor>

  abstract visitor$(): Observable<Visitor>

  abstract getVisitorPreferences(key:AuthUserKey):Promise<VisitorPreferences>

  abstract setVisitorPreferences(key:AuthUserKey, prefs: VisitorPreferences): Promise<void>

  abstract updateVisitorPreferences(key:AuthUserKey, prefs: VisitorPreferences): Promise<void>

}
