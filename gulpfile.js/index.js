/*
 gulpfile.js
 ===========
 Rather than manage one giant configuration file responsible
 for creating multiple tasks, each task has been broken out into
 its own file in gulpfile.js/tasks. Any files in that directory get
 automatically required below.

 To add a new task, simply add a new task file that directory.
 gulpfile.js/tasks/default.js specifies the default set of tasks to run
 when you run `gulp`.
 */

let requireDir = require('require-dir');
global.runmode = 'dev' ;

// Require all tasks in gulpfile.js/tasks, including subfolders
requireDir('./tasks', { recurse: true });





const gulp = require('gulp');
const cucumber = require('./tasks/cucumber');

gulp.task('cucumber', function() {
  return cucumber('test/functional/conf/cuke.conf.js');
});

gulp.task('cucumber-phantom', function() {
  return cucumber('test/functional/conf/cuke.phantom.conf.js');
});

gulp.task('cucumber-bs', function() {
  return cucumber('test/functional/conf/cuke.browserstack.conf.js');
});

gulp.task('cucumber-headless', function() {
  return cucumber('test/functional/conf/cuke.headless.conf.js');
});

