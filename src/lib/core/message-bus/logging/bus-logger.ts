import {
  Injectable,
  Optional
} from '@angular/core'
import {MessageBus} from '../message-bus'
import {LogMessage} from './log-message'
import {
  LoggerConfiguration,
  LogLevels
} from './logger'
import {ConsoleLogger} from './console-logger'

@Injectable()
export class BusLoggerConfiguration extends LoggerConfiguration {
  alsoLogToConsole:boolean = false
}

/**
 * Singleton. Attempting to run two Logger instances will fail. And rightly so!
 */
@Injectable()
export class BusLogger extends ConsoleLogger {

  config:BusLoggerConfiguration

  constructor(private bus: MessageBus, @Optional() configuration?: LoggerConfiguration) {
    super(configuration)
    console.log('BusLogger', 'constructor', configuration)
  }

  log(message: LogMessage) {
    this.bus.post(message)
    if(this.config.alsoLogToConsole){
      super.log(message)
    }
  }
}
