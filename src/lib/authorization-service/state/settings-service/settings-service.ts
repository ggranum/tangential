import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
//noinspection TypeScriptPreferShortImport
import {AuthSettings} from '../../media-type/cdm/auth-settings';

@Injectable()
export abstract class AuthSettingsService {

  abstract authSettings$(): Observable<AuthSettings>

}
