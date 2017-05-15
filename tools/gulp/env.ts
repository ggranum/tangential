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
  'default': {dev: false, prod: false, force: false, env: 'dev'}
};


export class Environment {
  options: Options

  constructor() {
    this.options = <any>minimist(process.argv.slice(2), knownOptions);
    if (!this.options.env) {
      if (this.options.dev) {
        this.options.env = 'dev'
      } else if (this.options.prod) {
        this.options.env = 'prod'
      } else {
        throw new Error('Environment not specified. Provide flag --prod, --dev, or specify with --env=\'foo\'')
      }
    }
    if(this.options.p){
      this.options.project = this.options.p
    }
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

