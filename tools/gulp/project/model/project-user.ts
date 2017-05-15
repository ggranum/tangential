import crypto = require('crypto');

export interface ProjectUserJson {
  uid?: string
  email?: string
  password?: string
  displayName?: string
  disabled?: boolean
}


export const DefaultUserTemplates:ProjectUserJson[] = [
  {
    uid: 'Administrator',
    email: 'example+administrator@example.com',
    password: '',
    displayName: 'Administrator',
    disabled: false
  },
  {
    'uid': 'TestUser',
    'email': 'example+testuser@example.com',
    'password': '',
    'displayName': 'Test User',
    'disabled': false
  },
  {
    'uid': 'AssistantAdmin',
    'email': 'example+assistant@example.com',
    'password': '',
    'displayName': 'Assistant Administrator',
    'disabled': false
  }
]

export class ProjectUser implements ProjectUserJson {
  uid: string
  email: string
  password: string
  displayName: string
  disabled: boolean

  constructor(cfg:ProjectUserJson | ProjectUser, generatePasswordIfAbsent:boolean = false){
    cfg = cfg || {}
    this.uid = cfg.uid
    this.email = cfg.email
    this.password = cfg.password
    this.displayName = cfg.displayName
    this.disabled = cfg.disabled

    if(!this.password && generatePasswordIfAbsent === true) {
      this.password = ProjectUser.generateRandomPassword()
    }
  }

  toJson():ProjectUserJson {
    return {
     uid: this.uid,
     email: this.email,
     password: this.password,
     displayName: this.displayName,
     disabled: this.disabled,
    }
  }

  static generateRandomPassword(length: number = 12): string {
    const password = crypto.randomBytes(length * 2).toString('base64')
    return password.substring(0, length)
  }


}

