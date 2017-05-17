import minimist = require('minimist')
import {DEFAULT_CONFIG_FILE_NAME, DEFAULT_CONFIG_ROOT} from './constants';
import * as path from 'path';


export type Options = {
  prod: boolean,
  dev: boolean,
  force: boolean,
  p: string,
  project: string,
  env: string
}
let knownOptions = {
  string: ['env', 'project'],
  alias: {
    'project': 'p'
  },
  boolean: ['dev', 'prod', 'force'],
  'default': {dev: false, prod: false, force: false}
};


export class Environment {
  options: Options

  constructor() {
    this.options = <any>minimist(process.argv.slice(2), knownOptions);
    if (!this.options.env) {
      if (this.options.prod) {
        this.options.env = 'prod'
      } else {
        this.options.env = 'dev'
      }
    }
    if(this.options.p){
      this.options.project = this.options.p
    }
    console.log('=info=', `Current environment set to ${this.options.env}`)
  }

  env(): string {
    return this.options.env
  }

  projectFile():string {
    return this.options.project || path.join(DEFAULT_CONFIG_ROOT, DEFAULT_CONFIG_FILE_NAME)
  }

  get force() {
    return this.options.force
  }
}

export const Env = new Environment()

