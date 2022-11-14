import {Visitor} from './media-type/cdm/visitor';
//noinspection ES6PreferShortImport
import {VisitorPreferences} from './media-type/cdm/visitor-preferences';

import {Observable} from 'rxjs';
//noinspection ES6PreferShortImport
import {AuthUserKey} from '../../media-type/doc-model/auth-user';

export abstract class VisitorService {

  abstract awaitVisitor$(timeoutMils?: number): Observable<Visitor>

  abstract visitor$(): Observable<Visitor>

  abstract getVisitorPreferences(key:AuthUserKey):Promise<VisitorPreferences>

  abstract setVisitorPreferences(key:AuthUserKey, prefs: VisitorPreferences): Promise<void>

  abstract updateVisitorPreferences(key:AuthUserKey, prefs: VisitorPreferences): Promise<void>

}
