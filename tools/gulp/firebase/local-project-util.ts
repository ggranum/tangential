import fs = require('fs');
import crypto = require('crypto')
const readline = require('readline');
import {ReadLine} from 'readline';
import {PASSWORD_LENGTH} from './constants';


/**
 *
 */
export class LocalProjectUtil {

  private newProject() {
    this.createLocalConfigurationFiles()
  }

  private createLocalConfigurationFiles() {

  }


  static generateRandomPassword(length: number = 12): string {
    const password = crypto.randomBytes(length * 2).toString('base64')
    return password.substring(0, length)
  }

  static promptForUserEmailAddressTemplate(rl: ReadLine): Promise<string> {
    return new Promise((resolve, reject) => {
      console.log('Email template assumes you use gmail, which lets you use "username~{anything}@gmail.com"')
      console.log('    A blank value will allow you to provide each address individually.')
      rl.question(`Enter email address template for user emails:`, (email: string) => {
        resolve(email)
      })
    });
  }


  static promptForNewEmailAddressForUser(user: any, template: string, rl: ReadLine): Promise<any> {
    return new Promise((resolve, reject) => {
      if (template) {
        const validUser = Object.assign({}, user, {
          email: `${template}${LocalProjectUtil.safeEmail(user.email || user.uid)}@gmail.com`,
          password: user.password || LocalProjectUtil.generateRandomPassword(PASSWORD_LENGTH)
        })
        resolve(validUser)

      } else {
        rl.question(`Email address for user '${user.displayName}':  `, (email: string) => {
          const validUser = Object.assign({}, user, {
            email: email || `${user.uid}@example.com`,
            password: user.password || LocalProjectUtil.generateRandomPassword(PASSWORD_LENGTH)
          })
          resolve(validUser)
        })
      }

    });
  }

  static safeEmail(text: string): string {
    let email = text || ''
    const atSignIndex = email.indexOf('@')
    if (atSignIndex > -1) {
      email = email.substring(0, atSignIndex)
    } else {
      email = email.toLowerCase().replace(' ', '_')
    }
    return email
  }


  static getReadLine() {
    return readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }



  static transformUser(user: any, emailTemplate: string, rl): Promise<any> {
    return LocalProjectUtil.promptForNewEmailAddressForUser(user, emailTemplate, rl)
  }

  static transformUsers(authUsersAry: any[]): Promise<any[]> {
    let rl = LocalProjectUtil.getReadLine()
    return new Promise((resolveLoop, rejectLoop) => {
      const validAuthUsersAry: any[] = []
      let template = ''
      let p = LocalProjectUtil.promptForUserEmailAddressTemplate(rl).then((value) => {
        template = value
      })
      for (let i = 0; i <= authUsersAry.length; i++) {
        p = p.then(() => this.transformUser(authUsersAry[i], template, rl).then((validUser) => {
          validAuthUsersAry.push(validUser)
          if (validAuthUsersAry.length === authUsersAry.length) {
            rl.close()
            resolveLoop(validAuthUsersAry)
          }
          return validUser
        }));
      }
    });
  }




}
