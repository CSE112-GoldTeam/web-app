// gulpfile.js
var gulp = require('gulp');
var server = require('gulp-express');
var nodemon = require('gulp-nodemon');
var jshint = require('gulp-jshint');
var browserSync = require('browser-sync');

gulp.task('nodemon', function (cb) {
  var called = false;
  return nodemon({

    // nodemon our expressjs server
    script: 'bin/www',

    // watch core server file(s) that require server restart on change
    watch: ['./'],

    ext: 'html js',
    env: { 'NODE_ENV': 'development' }
  })
    .on('start', function onStart() {
      // ensure start only got called once
      if (!called) { cb(); }
      called = true;
    })
    .on('restart', function onRestart() {
      browserSync.reload({
        stream: true
      });
    });
});

gulp.task('browser-sync', ['nodemon'], function () {

  // for more browser-sync config options: http://www.browsersync.io/docs/options/
  browserSync.init({

    // watch the following files; changes will be injected (css & images) or cause browser to refresh
    files: ['public/**/*.*', 'views/**/*.*'],

    // informs browser-sync to proxy our expressjs app which would run at the following location
    proxy: 'http://localhost:3000',

    // informs browser-sync to use the following port for the proxied app
    // notice that the default port is 3000, which would clash with our expressjs
    port: 4000,

    //Change whether browser will auto open
    open: true,

    // open the proxied app in chrome
    browser: ['google chrome']
  });
});


gulp.task('default', ['browser-sync']);


var karma = require('karma').server;
/**
 * Run test once and exit
 */
gulp.task('test', function (done) {
  karma.start({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done);
});
