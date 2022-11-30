import {
  Injectable,
  Optional
} from '@angular/core'
import {LogMessage} from './log-message'
import {
  LoggerConfiguration,
  Logger
} from './logger'

const spaces = '                                                                                                    '


/**
 * Singleton. Attempting to run two Logger instances will fail. And rightly so!
 */
@Injectable()
export class ConsoleLogger extends Logger {

  constructor(@Optional() configuration?: LoggerConfiguration) {
    super(configuration)
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



}
