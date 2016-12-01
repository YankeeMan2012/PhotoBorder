var gulp         = require('gulp');
var minifyCss    = require('gulp-minify-css');
var sass         = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps   = require('gulp-sourcemaps');
var notify       = require("gulp-notify");

gulp.task('main', function(){
   return gulp.src('src/scss/photo.scss')
       // .pipe(sourcemaps.init())
       .pipe(sass().on('error', sass.logError))
       .pipe(autoprefixer('last 4 versions'))
       // .pipe(minifyCss())
       // .pipe(sourcemaps.write())
       .pipe(gulp.dest('web/css'))
});

gulp.task('watcher',function(){
   gulp.watch('src/scss/photo.scss', ['main']);
   gulp.watch('src/scss/partials/*.scss', ['main']);
});

//____________________________
gulp.task('default', ['watcher']);
