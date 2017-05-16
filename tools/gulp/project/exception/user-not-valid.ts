import {TangentialError} from './tangential-error';

export class UserNotValid extends TangentialError {

  constructor(message: string) {
    super(message);
  }



}
