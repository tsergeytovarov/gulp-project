/*
  Author - Sergey Popov.
  Author URI: http://ourworkspace.ru
  Author social: https://vk.com/sergeytovarov
  Author email: tovarov.piter@gmail.com
  From Saint-Petersburg with love
*/

// gulp init
var gulp = require('gulp');

// plugins init
var clean = require('gulp-clean'); // Clean paths
var less = require('gulp-less'); // LESS Compiler
var path = require('path');

gulp.task('clean', function () {
    return gulp.src('build', {read: true})
        .pipe(clean());
});

// gulp less task
gulp.task('less', function () {
  return gulp.src('src/less/style.less')
    .pipe(less({
      paths: [ path.join(__dirname, 'less', 'includes') ]
    }))
    .pipe(gulp.dest('build/css/'));
});

// base gulp task
gulp.task('default', ['clean','less']);
