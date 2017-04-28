import {BusMessage} from '../message-bus'
import {LogLevel} from './logger'


export class LogMessage extends BusMessage {

  context?: any
  message: any[]
  level: LogLevel

  constructor(level: LogLevel, context: any, ...message: any[]) {
    super('log-message')
    this.message = message
    this.context = context
    this.level = level
  }


  static guard(value: any): value is LogMessage {
    //noinspection JSTypeOfValues
    return value instanceof LogMessage
  }

}
