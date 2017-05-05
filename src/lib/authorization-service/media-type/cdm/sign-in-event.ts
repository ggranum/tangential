import {SignInEventDm} from '../doc-model/sign-in-event';
import {AuthSubject} from './auth-subject';

export class SignInEvent {
  uid: string
  whenMils: number
  city: string
  country: string
  ipAddress: string
  region: string
  latLong: {
    lat: number
    long: number
  }


  constructor() {
    this.whenMils = Date.now()
  }

  static forSubject(subject: AuthSubject):SignInEvent {
    let sessionInfo = subject.sessionInfo
    let cdm = new SignInEvent()
    cdm.uid = subject.$key
    cdm.whenMils = sessionInfo.createdMils
    cdm.ipAddress = sessionInfo.ipAddress
    cdm.city = sessionInfo.city
    cdm.country = sessionInfo.country
    cdm.region = sessionInfo.region
    cdm.latLong= sessionInfo.latLong
    return cdm
  }
}

export class SignInEventTransform{



  static toDocModel(event:SignInEvent):SignInEventDm{
    return {
      uid: event.uid,
      whenMils: event.whenMils,
      city: event.city,
      country: event.country,
      ipAddress: event.ipAddress,
      region: event.region,
      cityLatLong: event.latLong.lat + "," + event.latLong.long
    }
  }

}
