import {Subscription} from 'rxjs'
export class ReactiveUtil {

  static unSub(subscription: Subscription) {
    if (subscription) {
      subscription.unsubscribe()
    }
  }

}
