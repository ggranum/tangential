// Karma configuration file, see link for more information
// https://karma-runner.github.io/0.13/config/configuration-file.html
let path = require('path');
module.exports = function (config) {
  config.set({
    basePath: '..',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage-istanbul-reporter'),
      require('@angular-devkit/build-angular/plugins/karma'),
      require('karma-mocha-reporter'),
    ],
    client:{
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    files: [

    ],
    preprocessors: {

    },
    mime: {
      'text/x-typescript': ['ts','tsx'],
      'application/javascript': ['js']
    },
    coverageIstanbulReporter: {
      dir: require('path').join(__dirname, 'coverage'), reports: [ 'html', 'lcovonly' ],
      fixWebpackSourcePaths: true
    },
    angularCli: {
      environment: 'dev'
    },

    reporters: ['mocha'],
    // reporters: config.angularCli && config.angularCli.codeCoverage ? ['mocha', 'coverage-istanbul'] : ['mocha', 'kjhtml'],
    mochaReporter: {
      output: 'full',
      colors: {
        success: 'blue',
        info: 'gray',
        warning: 'cyan',
        error: 'bgRed'
      },
      symbols: {
        success: '+',
        info: '#',
        warning: '!',
        error: 'x'
      }
    },
    specReporter: {
      maxLogLines: 50,         // limit number of lines logged per test
      suppressErrorSummary: true,  // do not print error summary
      suppressFailed: false,  // do not print information about failed tests
      suppressPassed: false,  // do not print information about passed tests
      suppressSkipped: false,  // do not print information about skipped tests
      showSpecTiming: true // print the time elapsed for each spec
    },
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome_with_debugging'],
    customLaunchers: {
      Chrome_with_debugging: {
        base: 'Chrome',
        chromeDataDir: path.resolve(__dirname, '.chrome')
      }
    },
    singleRun: false
  });
};
