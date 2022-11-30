import {BusMessage} from '../message-bus'
import {LogLevel} from './logger'

export class LogMessage extends BusMessage {
  static SourceKey:string = "LogMessage"
  context?: any
  message: any[]
  level: LogLevel

  constructor(level: LogLevel, context: any, ...message: any[]) {
    super(LogMessage.SourceKey, 'log')
    this.message = message
    this.context = context
    this.level = level
  }

}
