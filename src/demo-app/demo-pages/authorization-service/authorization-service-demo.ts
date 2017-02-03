import {Component, Input, OnChanges, ChangeDetectionStrategy, LOCALE_ID, Inject} from "@angular/core";
import {DatePipe} from "@angular/common";
import {AuthUser, AuthRole, AuthPermission, EmailPasswordCredentials} from "@tangential/media-types";
import {VisitorService, SignInState} from "@tangential/authorization-service";


@Component({
  selector: 'authorization-service-demo',
  templateUrl: 'authorization-service-demo.html',
  styleUrls: ['authorization-service-demo.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class AuthorizationServiceDemo implements OnChanges {

  @Input() visitor: AuthUser
  @Input() visitorRoles: AuthRole[]
  @Input() visitorGrantedPermissions: AuthPermission[]
  @Input() visitorEffectivePermissions: AuthPermission[]
  @Input() signInState: SignInState

  visitorTableColumns: any[]
  visitorTableValues: {colOne: string, colTwo: any}[] = [
    {colOne: "User Id", colTwo: 'Not Signed In'}
  ]

  constructor(private _visitorService: VisitorService, @Inject(LOCALE_ID) private _locale: string) {

    console.log('AuthorizationServiceDemo', 'constructor', _locale)
    this.visitorTableColumns = [
      {field: "colOne", header: " - "},
      {field: "colTwo", header: " - "}
    ]

    this.visitorTableValues = []

  }

  ngOnChanges(changes: any) {
    if (changes.visitor && this.visitor) {
      let datePipe = new DatePipe(this._locale)
      this.visitorTableValues = [
        {colOne: "User Id", colTwo: this.visitor.$key},
        {colOne: "Display Name", colTwo: this.visitor.displayName},
        {colOne: "Created", colTwo: datePipe.transform(this.visitor.createdMils)},
        {colOne: "Disabled", colTwo: this.visitor.disabled},
        {colOne: "Email", colTwo: this.visitor.email},
        {colOne: "Email Verified", colTwo: this.visitor.$key},
        {colOne: "Is Anonymous", colTwo: this.visitor.isAnonymous},
        {colOne: "Last Sign In IP", colTwo: this.visitor.lastSignInIp},
        {colOne: "Last Sign In", colTwo: datePipe.transform(this.visitor.lastSignInMils)},
        {colOne: "PhotoURL", colTwo: this.visitor.photoURL}
      ]
    }
    if (changes.signInState) {
      console.log('AuthorizationServiceDemo', 'ngOnChanges signInState', this.signInState)
    }
  }

  onSignOut() {
    console.log('AuthorizationServiceDemo', 'onSignOut')
    this._visitorService.signOut().then(() => {
      console.log('AuthorizationServiceDemo', 'Signed out')
    })
  }

  onSignIn(event: EmailPasswordCredentials) {
    console.log('AuthorizationServiceDemo', 'onSignIn', event)
    this._visitorService.signInWithEmailAndPassword(event).then((user) => {
      console.log('AuthorizationServiceDemo', 'signed in as', user)
    })
  }

  onSignUp(event: EmailPasswordCredentials) {
    console.log('AuthorizationServiceDemo', 'onSignUp', event)
  }


}

