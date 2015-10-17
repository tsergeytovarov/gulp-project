/*
  Автор - Sergey Popov.
  Сайт автора: http://ourworkspace.ru
  Email: tovarov.piter@gmail.com
  Из Санкт-Петербурга с любовью
*/

'use strict';

/* Подключение необходимых плагинов */
var gulp = require('gulp'),
    path = require('path'),
    watch = require('gulp-watch'),
    rename = require("gulp-rename"),
    del = require('del'),
    rigger = require('gulp-rigger'),
    concat = require('gulp-concat'),
    streamqueue = require('streamqueue'),
    sourcemaps = require('gulp-sourcemaps'),
    less = require('gulp-less'),
    lessReporter = require('gulp-less-reporter'),
    autoprefixer = require('gulp-autoprefixer'),
    csscomb = require('gulp-csscomb'),
    minifycss = require('gulp-minify-css'),
    uglify = require('gulp-uglify'),
    jshint = require('gulp-jshint'),
    stylish = require('jshint-stylish'),
    browserSync = require("browser-sync"),
    reload = browserSync.reload,
    runSequence = require('run-sequence').use(gulp);

/* Настройка деррикторий */
var projectPath = {
  build: {
    html: 'build/',
    js: 'build/js/',
    jsMainFile: 'script.js',
    css: 'build/css/',
    img: 'build/img/',
    fonts: 'build/css/fonts/'
  },
  src: {
    html: 'src/*.html',
    jsCustom: 'src/js/custom.js',
    jsVendor: 'src/js/vendor.js',
    style: 'src/css/style.less',
    formats: ['src/img/*.png', 'src/img/*.jpg', 'src/img/*.svg'],
    fonts: 'src/css/fonts/*.*'
  },
  watch: {
    html: 'src/*.html',
    js: 'src/js/**/*.js',
    style: 'src/css/**/*.less',
    formats: ['src/img/*.png', 'src/img/*.jpg', 'src/img/*.svg'],
    fonts: 'src/css/fonts/*.*'
  },
  clean: ['build/**/*', '!build/.gitignore']
};

/* Конфигурация BrowserSync */
var config = {
  server: {
    baseDir: "./build"
  },
  tunnel: true,
  host: 'localhost',
  port: 9000,
  injectChanges: true,
  logPrefix: "gulp template"
};

/* BrowserSync*/
gulp.task('webserver', function () {
  browserSync(config);
});

gulp.task('js', function () {
  return streamqueue(
    { objectMode: true },
    gulp.src(projectPath.src.jsVendor).pipe(rigger()),
    gulp.src(projectPath.src.jsCustom).pipe(rigger()).pipe(jshint()).pipe(jshint.reporter(stylish))
  )
  .pipe(concat(projectPath.build.jsMainFile))
  .pipe(sourcemaps.init())
  .pipe(gulp.dest(projectPath.build.js))
  .pipe(rename({ suffix: '.min' }))
  .pipe(uglify())
  .pipe(sourcemaps.write('./'))
  .pipe(gulp.dest(projectPath.build.js))
  .pipe(reload({stream: true}));
});

gulp.task('html', function() {
  return gulp.src(projectPath.src.html)
    .pipe(gulp.dest(projectPath.build.html))
    .pipe(reload({stream: true}));
});

gulp.task('less', function() {
  return gulp.src(projectPath.src.style)
    .pipe(sourcemaps.init())
    .pipe(less({
        paths: [ path.join(__dirname, 'less', 'includes') ]
    }))
    .on('error', lessReporter)
    .pipe(autoprefixer('> 2%'))
    .pipe(csscomb())
    .pipe(gulp.dest(projectPath.build.css))
    .pipe(rename({ suffix: '.min' }))
    .pipe(minifycss())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(projectPath.build.css))
    .pipe(reload({stream: true}));
});

gulp.task('images', function () {
  return gulp.src(projectPath.src.formats)
    .pipe(gulp.dest(projectPath.build.img))
    .pipe(reload({stream: true}));
});

gulp.task('fonts', function() {
  return gulp.src(projectPath.src.fonts)
    .pipe(gulp.dest(projectPath.build.fonts))
    .pipe(reload({stream: true}));
});

gulp.task('clean', function (cb) {
  del(projectPath.clean, cb);
});

gulp.task('build', function(callback) {
  runSequence('clean','html','fonts','less','images','js',callback)
});

gulp.task('watch',['webserver'], function(){
  watch([projectPath.watch.js], function(event, cb) {
    gulp.start('js');
  });
  watch([projectPath.watch.style], function(event, cb) {
    gulp.start('less');
  });
  watch([projectPath.watch.formats], function(event, cb) {
    gulp.start('images');
  });
  watch([projectPath.watch.fonts], function(event, cb) {
    gulp.start('fonts');
  });
  watch([projectPath.watch.html], function(event, cb) {
    gulp.start('html');
  });
});

/* Базовый таск */
gulp.task('default', ['watch'], function() {});
