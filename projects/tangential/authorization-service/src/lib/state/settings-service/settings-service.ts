import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
//noinspection ES6PreferShortImport
import {AuthSettings} from '../../media-type/cdm/auth-settings';

@Injectable()
export abstract class AuthSettingsService {

  abstract authSettings$(): Observable<AuthSettings>

}
