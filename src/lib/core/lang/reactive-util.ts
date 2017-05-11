import {Subscription} from 'rxjs/Subscription'
export class ReactiveUtil {

  static unSub(subscription: Subscription) {
    if (subscription) {
      subscription.unsubscribe()
    }
  }

}
