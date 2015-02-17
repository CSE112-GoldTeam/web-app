// gulpfile.js
var gulp = require('gulp');
var server = require('gulp-express');
var nodemon = require('gulp-nodemon');
var jshint = require('gulp-jshint');

gulp.task('express-run', function () {
  nodemon({ script: 'bin/www', ext: 'html js css hjs', env: { 'NODE_ENV': 'development' }})
    .on('change', ['lint'])
    .on('restart', function () {
      console.log('restarted!')
    })
})

gulp.task('lint', function () {
  gulp.src('./**/*.js')
    .pipe(jshint())
})

gulp.task('default', ['express-run']);

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
