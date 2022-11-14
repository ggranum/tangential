import {TangentialError} from './tangential-error';

export class FirebasePrivateKeyMismatch extends TangentialError {

  constructor(message: string) {
    super(message);
  }

}
