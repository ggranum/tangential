import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewEncapsulation
} from '@angular/core'
import {MatSnackBar} from '@angular/material/snack-bar'
import {MessageBus} from '@tangential/core'
import {
  NotificationMessage,
  NotificationResponseMessage
} from './notification'

@Component({
  selector:        'tanj-notification-bar',
  templateUrl:     './notification-bar.component.html',
  encapsulation:   ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotificationBarComponent implements OnInit {

  notification: NotificationMessage

  constructor(private bus: MessageBus, private snackBar: MatSnackBar) {
  }


  ngOnInit(): void {
    NotificationMessage.filter(this.bus).subscribe(notice => this.handleNewNotification(notice))
  }

  onDismissAction() {
    this._clearNotification({dismissedBy: 'click'})
  }

  private handleNewNotification(notice: NotificationMessage) {
    this.snackBar.open(notice.message, 'Dismiss', notice);
    // if(this.notification){
    //   this._clearNotification({dismissedBy: "newMessage"})
    // }
    // this.notification = notice
    // this.changeDetectorRef.markForCheck()
    // if (notice.duration) {
    //   setTimeout(() => {
    //     this._clearNotification({dismissedBy: "timeout"})
    //     this.changeDetectorRef.markForCheck()
    //   }, notice.duration)
    // }
  }

  private _clearNotification(response: { dismissedBy: string }) {
    if (this.notification) {
      this.bus.post(NotificationResponseMessage.responseFor(this.notification, response))
      this.notification = null
    }
  }
}



