// Karma configuration
// Generated on Fri Oct 16 2015 02:26:28 GMT+0000 (UTC)

module.exports = function(config) {
  'use strict';
  
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha', 'chai-as-promised', 'chai-dom', 'chai', 'sinon-chai'],

  
    client: {
      mocha: {
        timeout: 5000
      }
    },
    
    // list of files / patterns to load in the browser
    files: [
      'test/sitekey.js',
      'bower_components/angular/angular.js',
      'angular-g-recaptcha.js',
      'bower_components/angular-mocks/angular-mocks.js',
      
      'test/**/*Spec.js'
    ],

    
    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'angular-g-recaptcha.js': 'coverage'
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['spec', 'coverage'],


    // web server port
    port: process.env.PORT || 9876,

    
    // web server hostname
    hostname: process.env.IP || 'localhost',
    
    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS', 'Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
  })
}
