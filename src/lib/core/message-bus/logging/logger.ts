import {
  Injectable,
  Optional
} from '@angular/core'
import {LogMessage} from './log-message'

const spaces = '                                                                                                    '

export type LogLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal' | 'NONE'

/**
 *
 *
 */
export const LogLevels = {
  NONE:  <LogLevel>'NONE',
  fatal: <LogLevel>'fatal',
  error: <LogLevel>'error',
  warn:  <LogLevel>'warn',
  info:  <LogLevel>'info',
  debug: <LogLevel>'debug',
  trace: <LogLevel>'trace'
}

export class LoggerConfiguration {
  contextAsStringWidth: number = 30
  includeFullContext: boolean = false
  /**
   * For temporarily shutting of logging, use NONE, but if you are shutting off logging for production, or because you're using
   * another logging system, you should Provide a simpler logging class in your module configuration.
   * @type {LogLevel}
   */
  logLevel: LogLevel = 'trace'
}

const emptyFn = function (...x: any[]): any {}


@Injectable()
export abstract class Logger {

  config: LoggerConfiguration = new LoggerConfiguration()

  constructor(@Optional() configuration?: LoggerConfiguration) {
    this.config = configuration || this.config
    this.applyLevel()
  }

  abstract log(message: LogMessage)

  trace(context: any, ...message) {
    this.log(new LogMessage('trace', context, ...message))
  }

  debug(context: any, ...message) {
    this.log(new LogMessage('debug', context, ...message))
  }

  info(context: any, ...message) {
    this.log(new LogMessage('info', context, ...message))
  }

  warn(context: any, ...message) {
    this.log(new LogMessage('warn', context, ...message))
  }

  error(context: any, ...message) {
    this.log(new LogMessage('error', context, ...message))
  }

  fatal(context: any, ...message) {
    this.log(new LogMessage('fatal', context, ...message))
  }


  private applyLevel() {
    console.log('Logger', 'applyLevel', this.config)
    /**
     * A bit hacky, but this keeps noise off the system bus when running in production mode or with logging off.
     */
    //noinspection FallThroughInSwitchStatementJS
    switch (this.config.logLevel) {
      case LogLevels.NONE:
        this.fatal = emptyFn
      case LogLevels.fatal:
        this.error = emptyFn
      case LogLevels.error:
        this.warn = emptyFn
      case LogLevels.warn:
        this.info = emptyFn
      case LogLevels.info:
        this.debug = emptyFn
      case LogLevels.debug:
        this.trace = emptyFn
    }
  }

}
