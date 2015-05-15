
var gulp = require('gulp');
var watch = require('gulp-watch');
var ez = require('./');

gulp.task('default', function() {
  return gulp.src('test_data/*')
  .pipe(ez())
  .pipe(gulp.dest('dest'));
});

gulp.task('watch', function() {
  return watch('test_data/*')
  .pipe(ez())
  .pipe(gulp.dest('dest'));
});
