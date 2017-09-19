var gulp = require('gulp')
var stylus = require('gulp-stylus')
var sourcemaps = require('gulp-sourcemaps')

gulp.task('styles', function() {
  return gulp
    .src('src/styles/main.styl')
    .pipe(sourcemaps.init())
    .pipe(stylus())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('static/css'))
})

gulp.task('watch', function() {
  gulp.watch('src/styles/**/*.styl', ['styles'])
})

gulp.task('default', ['watch'])
