import minimist = require('minimist')


export type Options = {
  prod: boolean,
  dev: boolean,
  force: boolean,
  env: string
}
let knownOptions = {
  string: 'env',
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
  }

  env(): string {
    return this.options.env
  }

  get force() {
    return this.options.force
  }
}

export const Env = new Environment()

