// Karma configuration
// Generated on Tue Nov 22 2016 11:00:31 GMT+0800 (MYT)

module.exports = function(config) {

  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: './public',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'), // click "Debug" in browser to see it
      require('karma-htmlfile-reporter') // crashing w/ strange socket error
    ],

    // list of files / patterns to load in the browser
    files: [
      // System.js for module loading
      'systemjs/dist/system.src.js',

      // Polyfills
      'core-js/client/shim.js',
      'reflect-metadata/Reflect.js',

      // zone.js
      'zone.js/dist/zone.js',
      'zone.js/dist/long-stack-trace-zone.js',
      'zone.js/dist/proxy.js',
      'zone.js/dist/sync-test.js',
      'zone.js/dist/jasmine-patch.js',
      'zone.js/dist/async-test.js',
      'zone.js/dist/fake-async-test.js',

      // RxJs
      { pattern: 'rxjs/**/*.js', included: false, watched: false },
      { pattern: 'rxjs/**/*.js.map', included: false, watched: false },

      // Paths loaded via module imports:
      // Angular itself
      { pattern: '@angular/**/*.js', included: false, watched: false },
      { pattern: '@angular/**/*.js.map', included: false, watched: false },

      { pattern: 'systemjs.config.js', included: false, watched: false },
      // { pattern: 'systemjs.config.extras.js', included: false, watched: false },
      'karma-test-shim.js',

      // transpiled application & spec code paths loaded via module imports
      { pattern: '**/*.js', included: false, watched: true },

      // Asset (HTML & CSS) paths loaded via Angular's component compiler
      // (these paths need to be rewritten, see proxies section)
      { pattern: '**/*.html', included: false, watched: true },
      { pattern: '**/*.css', included: false, watched: true },

      // Paths for debugging with source maps in dev tools
      { pattern: '**/*.ts', included: false, watched: false },
      { pattern: '**/*.js.map', included: false, watched: false }
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress', 'kjhtml'],//'html'],

    htmlReporter: {
      // Open this file to see results in browser
      outputFile: '_test-output/tests.html',

      // Optional
      pageTitle: 'Unit Tests',
      subPageTitle: __dirname
    },


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
}
