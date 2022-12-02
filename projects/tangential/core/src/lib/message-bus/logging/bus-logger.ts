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

  override config:BusLoggerConfiguration = new BusLoggerConfiguration()

  constructor(private bus: MessageBus, @Optional() configuration?: LoggerConfiguration) {
    super(configuration)
    console.log('BusLogger', 'constructor', configuration)
  }

  override log(message: LogMessage): void {
    this.bus.post(message)
    if(this.config.alsoLogToConsole){
      super.log(message)
    }
  }
}
