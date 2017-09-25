var gulp = require('gulp')
var babel = require('gulp-babel')
var stylus = require('gulp-stylus')
var sourcemaps = require('gulp-sourcemaps')
var autoprefixer = require('gulp-autoprefixer')

gulp.task('styles', function() {
  return gulp
    .src('src/styles/*.styl')
    .pipe(sourcemaps.init())
    .pipe(stylus())
    .pipe(
      autoprefixer({
        browsers: ['last 2 versions']
      })
    )
    .pipe(sourcemaps.write())
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
