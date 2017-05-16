import crypto = require('crypto');
import {UserNotValid} from '../exception/user-not-valid';

export interface ProjectUserJson {
  uid?: string
  email?: string
  password?: string
  displayName?: string
  disabled?: boolean
}


export const DefaultUserTemplates: ProjectUserJson[] = [
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
  disabled: boolean
  displayName: string
  email: string
  password: string
  uid: string

  constructor(cfg: ProjectUserJson | ProjectUser, generatePasswordIfAbsent: boolean = false) {
    cfg = cfg || {}
    this.disabled = cfg.disabled
    this.displayName = cfg.displayName
    this.email = cfg.email
    this.password = cfg.password
    this.uid = cfg.uid

    if (!this.password && generatePasswordIfAbsent === true) {
      this.password = ProjectUser.generateRandomPassword()
    }
  }

  checkValid() {
    if (!this.disabled) {
      this.checkEmailValid()
      this.checkPasswordValid()
      this.checkUidValid()
    }
  }

  checkEmailValid() {
    if (!this.email || this.email.indexOf('@') < 1) {
      throw new UserNotValid(`User's email must exists and be a valid email address.`)
    }
    if (this.email.indexOf('example') > -1) {
      throw new UserNotValid(
        `User ${this.displayName} has not been configured. Email address is still set to the example value of ${this.email}`)
    }
  }

  checkPasswordValid() {
    if (!this.password || this.password.length < 8) {
      throw new UserNotValid(
        `User ${this.displayName} is either missing a password or using an insecure password.
    Password must be set and greater than 8 characters in length.`)
    }
  }

  checkUidValid() {
    if (!this.uid || this.uid.length < 3) {
      throw new UserNotValid(
        `User's UID must exist and be at least 3 characters long. 
    Found: ${this.uid} on user with display name '${this.displayName}' and email '${this.email}'`)
    }
  }

  toJson(): ProjectUserJson {
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

