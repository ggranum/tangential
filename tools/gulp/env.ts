import minimist = require('minimist')


export type Options = {
  prod: boolean,
  dev: boolean,
  env: string
}
let knownOptions = {
  string:    'env',
  boolean:   ['dev', 'prod'],
  'default': {dev: false, prod: false, env: 'dev'}
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
        throw new Error("Environment not specified. Provide flag --prod, --dev, or specify with --env='foo'")
      }
    }
  }

  env():string {
    return this.options.env
  }
}

export const Env = new Environment()

