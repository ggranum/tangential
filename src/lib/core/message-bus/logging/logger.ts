import {Injectable, Optional} from '@angular/core'
import {MessageBus} from '../message-bus'
import {LogMessage} from './log-message'

const spaces = '                                                                                                    '

export type LogLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal' | 'NONE'
export const LogLevels = {
  NONE:  <LogLevel>'NONE',
  fatal: <LogLevel>'fatal',
  error: <LogLevel>'error',
  warn:  <LogLevel>'warn',
  info:  <LogLevel>'info',
  debug: <LogLevel>'debug',
  trace: <LogLevel>'trace'
}

export class LogConfiguration {
  logLevel: LogLevel = 'trace'
  includeFullContext: boolean = false
  contextAsStringWidth: number = 30
}

let level: LogLevel = LogLevels.trace
const emptyFn = function (...x: any[]): any {
}


/**
 * Singleton. Attempting to run two Logger instances will fail. And rightly so!
 */
@Injectable()
export class Logger {

  config: LogConfiguration = new LogConfiguration()

  constructor(private bus: MessageBus, @Optional() configuration?: LogConfiguration) {
    this.config = configuration || this.config
    level = this.config.logLevel
    this.applyLevel()
  }

  log(message: LogMessage) {
    let args = [message.level + ':']
    let name: string = ''
    if (message.context && !this.config.includeFullContext && message.context.constructor) {
      name = message.context._proto_ ? message.context._proto_.name : message.context.constructor.name
    }
    const padChars = this.config.contextAsStringWidth - name.length
    name = padChars > 0 ? name + spaces.substring(0, padChars) : name
    args.push(name + ' - ')
    args = args.concat(message.message)

    if (this.config.includeFullContext && message.context) {
      args.push(message.context)
    }

    console.log.apply(console, args)
  }

  /**
   * A bit hacky, but this keeps noise off the system bus when running in production mode or with logging off.
   */
  private applyLevel() {
    if (level !== LogLevels.NONE) {
      this.bus.all.filter(m => LogMessage.guard(m)).subscribe({
        next: (msg: LogMessage) => this.log(msg)
      })
    }
    //noinspection FallThroughInSwitchStatementJS
    switch (level) {
      case LogLevels.NONE:
        Logger.fatal = emptyFn
      case LogLevels.fatal:
        Logger.error = emptyFn
      case LogLevels.error:
        Logger.warn = emptyFn
      case LogLevels.warn:
        Logger.info = emptyFn
      case LogLevels.info:
        Logger.debug = emptyFn
      case LogLevels.debug:
        Logger.trace = emptyFn
    }
  }

  static trace(bus: MessageBus, context: any, ...message: any[]) {
    bus.post(new LogMessage('trace', context, ...message))
  }

  static debug(bus: MessageBus, context: any, ...message: any[]) {
    bus.post(new LogMessage('debug', context, ...message))
  }

  static info(bus: MessageBus, context: any, ...message: any[]) {
    bus.post(new LogMessage('info', context, ...message))
  }

  static warn(bus: MessageBus, context: any, ...message: any[]) {
    bus.post(new LogMessage('warn', context, ...message))
  }

  static error(bus: MessageBus, context: any, ...message: any[]) {
    bus.post(new LogMessage('error', context, ...message))
  }

  static fatal(bus: MessageBus, context: any, ...message: any[]) {
    bus.post(new LogMessage('fatal', context, ...message))
  }

}
