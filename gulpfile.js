var gulp = require('gulp')
var babel = require('gulp-babel')
var stylus = require('gulp-stylus')
var sourcemaps = require('gulp-sourcemaps')
var autoprefixer = require('gulp-autoprefixer')
var gulpIf = require('gulp-if')
var gutil = require('gulp-util')


gulp.task('styles', function() {
  return gulp
    .src('src/styles/pages/*.styl')
    .pipe( gulpIf(isDev(), sourcemaps.init()) )
      .pipe(stylus({
        compress: true
      }))
      .pipe(
        autoprefixer({
          browsers: ['last 2 versions']
        })
      )
    .pipe( gulpIf(isDev(), sourcemaps.write()) )
    .pipe(gulp.dest('static/css'))
})

gulp.task('js', function() {
  return gulp
    .src('src/js/**/*.js')
    .pipe(babel())
    .pipe(gulp.dest('static/js'))
})

gulp.task('watch', function() {
  gulp.watch('src/styles/**/*.styl', ['styles'])
  gulp.watch('src/js/**/*.js', ['js'])
})


gulp.task('default', ['styles', 'js', 'watch'])
gulp.task('build', ['styles', 'js'])


function isDev() {
  return gutil.env.env === 'dev'
}
