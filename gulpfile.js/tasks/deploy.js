'use strict';

const gulp = require('gulp');
const publish = require('gulp-awspublish');
const rename = require('gulp-rename');

const environment = process.env.environment || 'local';

gulp.task('settings-to-dist', () => {
  const env = process.env.environment || 'local';

  gulp.src(`./config/${environment}.settings.js`)
    .pipe(rename('settings.js'))
    .pipe(gulp.dest('./dist'));
});

gulp.task('deploy', ['settings-to-dist'], () => {
  const conf = require(`../config/${environment}.json`);
  const bucket = conf.s3Bucket;

  console.log(`Deploying to bucket: ${bucket}`);

  const publisher = publish.create({
    params: {
      Bucket: bucket
    },
  });

  const headers = {
    'Cache-Control': 'max-age=300, no-transform, public'
  };
  const options = {
    force: true
  };

  return gulp
    .src('dist/**')
    .pipe(publisher.publish(headers, options))
    .pipe(publisher.sync())
    .pipe(publisher.cache())
    .pipe(publish.reporter());
});
