import {SignInEventDocModel} from '../auth/sign-in-event';
import {AuthUser} from '@tangential/authorization-service';
export class SignInEventCdm {
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

  toJson():SignInEventDocModel{
    return {
      uid: this.uid,
      whenMils: this.whenMils,
      city: this.city,
      country: this.country,
      ipAddress: this.ipAddress,
      region: this.region,
      cityLatLong: this.latLong.lat + "," + this.latLong.long
    }
  }

  static from(docModel:SignInEventDocModel):SignInEventCdm {
    let cdm = new SignInEventCdm()
    cdm.uid = docModel.uid
    cdm.whenMils = docModel.whenMils
    cdm.ipAddress = docModel.ipAddress
    cdm.city = docModel.city
    cdm.country = docModel.country
    cdm.region = docModel.region
    let latLong = docModel.cityLatLong ? docModel.cityLatLong.split(",") : ["0", "0"]
    cdm.latLong = {
        lat: Number.parseFloat(latLong[0]),
        long: Number.parseFloat(latLong[1])
    }
    return cdm
  }

  static fromSubject(subject: AuthUser):SignInEventCdm {
    let sessionInfo = subject.$sessionInfo
    let cdm = new SignInEventCdm()
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
