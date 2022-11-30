const headerKeys = [
  'user-agent',
  'accept-language',
  'origin',
  'x-appengine-city',
  'x-appengine-citylatlong',
  'x-appengine-country',
  'x-appengine-region',
  'x-appengine-user-ip',
  'x-forwarded-for'
]

export class SessionInfoCdm {
  createdMils: number;
  latLong: {
    lat: number
    long: number
  }
  city: string
  country: string
  region: string
  ipAddress: string
  rawHeaders: {
    'user-agent': string
    'accept-language': string
    'origin': string
    'x-appengine-city': string
    'x-appengine-citylatlong': string
    'x-appengine-country': string
    'x-appengine-region': string
    'x-appengine-user-ip': string
    'x-forwarded-for': string
  }


  constructor() {
    this.createdMils = Date.now()
    this.latLong = {lat: 0, long: 0}
  }

  static fromHeaders(raw: any): SessionInfoCdm {
    raw = raw || {}
    let cdm = new SessionInfoCdm()
    cdm.rawHeaders = <any>{}
    headerKeys.forEach(key => {
      cdm.rawHeaders[key] = raw[key] || ''
    })
    let latLong = cdm.rawHeaders['x-appengine-citylatlong'].split(",")
    cdm.latLong = {
      lat: Number.parseFloat(latLong[0]),
      long: Number.parseFloat(latLong[1])
    }
    cdm.city = cdm.rawHeaders['x-appengine-city']
    cdm.country = cdm.rawHeaders['x-appengine-country']
    cdm.region = cdm.rawHeaders['x-appengine-region']
    cdm.ipAddress = cdm.rawHeaders['x-appengine-user-ip']
    if(!cdm.ipAddress || cdm.ipAddress.startsWith('0')){
      cdm.ipAddress = cdm.rawHeaders['x-forwarded-for']
    }
    return cdm
  }
}
