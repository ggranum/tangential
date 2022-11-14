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

  protected constructor(@Optional() configuration?: LoggerConfiguration) {
    this.config = configuration || this.config
    this.applyLevel()
  }

  abstract log(message: LogMessage): void

  trace(context: any, ...message:any[]) {
    this.log(new LogMessage('trace', context, ...message))
  }

  debug(context: any, ...message:any[]) {
    this.log(new LogMessage('debug', context, ...message))
  }

  info(context: any, ...message:any[]) {
    this.log(new LogMessage('info', context, ...message))
  }

  warn(context: any, ...message:any[]) {
    this.log(new LogMessage('warn', context, ...message))
  }

  error(context: any, ...message:any[]) {
    this.log(new LogMessage('error', context, ...message))
  }

  fatal(context: any, ...message:any[]) {
    this.log(new LogMessage('fatal', context, ...message))
  }


  private applyLevel() {
    console.log('Logger', 'applyLevel', this.config)
    /**
     * This keeps noise off the system bus when running in production mode or with logging off.
     * Yes, it's supposed to fall through, despite the evil nature.
     */
    // @ts-ignore
    // noinspection FallThroughInSwitchStatementJS
    switch (this.config.logLevel) {
      // @ts-ignore
      case LogLevels.NONE:
        this.fatal = emptyFn
      // @ts-ignore
      case LogLevels.fatal:
        this.error = emptyFn
      // @ts-ignore
      case LogLevels.error:
        this.warn = emptyFn
      // @ts-ignore
      case LogLevels.warn:
        this.info = emptyFn
      // @ts-ignore
      case LogLevels.info:
        this.debug = emptyFn
      // @ts-ignore
      case LogLevels.debug:
        this.trace = emptyFn
      // @ts-ignore
    }
  }

}
