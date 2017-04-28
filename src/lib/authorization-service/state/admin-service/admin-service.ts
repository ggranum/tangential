import {Injectable} from '@angular/core'
import {MessageBus} from '@tangential/core'
import {Observable} from 'rxjs/Observable'
import {
  AuthCdm,
  AuthCdmTransform
} from '../../media-type/cdm/auth-cdm'
import {AuthService} from '../auth-service/auth-service'


@Injectable()
export class AdminService {


  constructor(private bus: MessageBus, private authService: AuthService) {
  }


  public conceptualDataModel$(): Observable<AuthCdm> {
    const obs = this.authService.authDocumentModel$()
    return obs.map(dm => {
      return AuthCdmTransform.fromDocModel(dm)
    })
  }

}
