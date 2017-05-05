import {Injectable} from '@angular/core';
import {MessageBus} from '@tangential/core';
import {Observable} from 'rxjs/Observable';
import {Auth, AuthTransform} from '../../media-type/cdm/auth';
import {AuthService} from '../auth-service/auth-service';


@Injectable()
export class AdminService {


  constructor(private bus: MessageBus, private authService: AuthService) {
  }


  public conceptualDataModel$(): Observable<Auth> {
    const obs = this.authService.authDocumentModel$()
    return obs.map(dm => {
      return AuthTransform.fromDocModel(dm)
    })
  }

}
