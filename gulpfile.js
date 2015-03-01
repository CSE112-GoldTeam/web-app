// gulpfile.js
var gulp = require('gulp');
var server = require('gulp-express');
var child_process = require('child_process');
var argv = require('yargs').argv;

var nodemon = require('gulp-nodemon');
var jshint = require('gulp-jshint');
var browserSync = require('browser-sync');

var mongobackup = require('mongobackup');
var shell = require('gulp-shell');


var exec = require('child_process').exec;
function execute(command, callback){
    exec(command, function(error, stdout, stderr){callback(stdout);});
};    

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

gulp.task('mongostart', function() {
    child_process.exec('mongod --dbpath db', function(err, stdout, stderr) {
        if(err) {
            console.log(err.stack);
            console.log("Error code: " + err.code);
            console.log("Signal received: " + err.signal);
        }
    });
});

gulp.task('mongoend', function() {

    child_process.exec("mongo --eval 'db.shutdownServer()' admin", function(err, stdout, stderr) {
        if(err) {
            console.log(err.stack);
            console.log("Error code: " + err.code);
            console.log("Signal received: " + err.signal);
        }
    });
})

gulp.task('browser-sync', ['nodemon', 'mongostart'], function () {

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

// mongodump - dump all databases on localhost
gulp.task('mongodump', function() {
  mongobackup.dump({
    host : 'localhost',
    out : './dumps/mongo'
  });
});

// mongorestore - restore database to localhost
gulp.task('mongorestore', function() {
  mongobackup.restore({
    host : 'localhost',
    drop : true,
    path : './dumps/mongo/'
  });
});


// prerequisites - must have heroku command line tools installed
//               - must be authenticated with heroku
//               - must have git installed and be in application root directory
//               - must be authenticated with git so that password does not have to be entered on push
gulp.task('stage', function(){ 
    if (argv.test == null){ 
        execute('git symbolic-ref --short HEAD', function(br){
            console.log('deploying current branch: ' + br);
            return gulp.src('')
                    .pipe(shell([
                        'heroku git:remote -a robobetty-test1 -r test1',
                        'git push -f test1 <%= determineBranch() %>'
                    ], {
                        templateData: {
                            determineBranch: function() {
                                var n_remote = br.trim() + ':master';
                                return n_remote;
                            }
                        }
                    }));
        }); 
    }

    if (argv.test == 1){ 
        execute('git symbolic-ref --short HEAD', function(br){
            console.log('deploying current branch: ' + br);
            return gulp.src('')
                    .pipe(shell([
                        'heroku git:remote -a robobetty-test1 -r test1',
                        'git push -f test1 <%= determineBranch() %>'
                    ], {
                        templateData: {
                            determineBranch: function() {
                                var n_remote = br.trim() + ':master';
                                return n_remote;
                            }
                        }
                    }));
        }); 
    }

    if (argv.test == 2){ 
        execute('git symbolic-ref --short HEAD', function(br){
            console.log('deploying current branch: ' + br);
            return gulp.src('')
                    .pipe(shell([
                        'heroku git:remote -a robobetty-test2 -r test2',
                        'git push -f test2 <%= determineBranch() %>'
                    ], {
                        templateData: {
                            determineBranch: function() {
                                var n_remote = br.trim() + ':master';
                                return n_remote;
                            }
                        }
                    }));
        }); 
    }


    if (argv.test == 3){ 
        execute('git symbolic-ref --short HEAD', function(br){
            console.log('deploying current branch: ' + br);
            return gulp.src('')
                    .pipe(shell([
                        'heroku git:remote -a robobetty-test3 -r test3',
                        'git push -f test3 <%= determineBranch() %>'
                    ], {
                        templateData: {
                            determineBranch: function() {
                                var n_remote = br.trim() + ':master';
                                return n_remote;
                            }
                        }
                    }));
        }); 
    } 
})

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

