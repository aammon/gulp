var gulp = require('gulp');
var sass = require('gulp-sass');
var shorthand = require('gulp-shorthand');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync');
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var uncss = require('gulp-uncss');
var csscomb = require('gulp-csscomb');
var csso = require('gulp-csso');
var bourbon = require('node-bourbon').includePaths;;
var neat = require('node-neat').includePaths;;
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var del = require('del');
var rename = require('gulp-rename');
var runSequence = require('run-sequence');

gulp.task('browserSync', function(){
    browserSync({
        server: {
            baseDir: 'src'
        }
    });
});
/* --- STYLE TASKS--- */
gulp.task('styles', function() {
  return gulp.src('src/assets/scss/style.scss')
    .pipe(sourcemaps.init())
        .pipe(sass({
            includePaths: bourbon,
            includePaths: neat
            }))
        .pipe(autoprefixer({
	       browsers: ['last 3 versions'],
	       cascade: false
	       }))
        .pipe(csso())
        .pipe(rename({suffix:'.min'}))
    .pipe(sourcemaps.write('../maps'))
    .pipe(gulp.dest('./app/css')) 
    .pipe(browserSync.reload({stream: true}));
})

gulp.task('stylesTwo',function(){
    return gulp.src('src/assets/scss/style.scss')
    .pipe(sourcemaps.init())
        .pipe(sass({
            includePaths: bourbon,
            includePaths: neat
        }))
        .pipe(csscomb())
        .pipe(shorthand())
        .pipe(autoprefixer({
            browsers: ['last 3 versions'],
            cascade: false
	    }))
    .pipe(sourcemaps.write('../maps'))
    .pipe(gulp.dest('src/assets/css'))
    .pipe(gulp.dest('./dist/css'))
    .pipe(browserSync.reload({stream:true}));
})

/*--- SCRIPT TASKS ---*/
gulp.task('scripts',function(){
    return gulp.src('src/assets/js/**/*.js')
    .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(rename({suffix:'.min'}))
    .pipe(sourcemaps.write('../maps'))
    .pipe(gulp.dest('./app/js'))
    .pipe(browserSync.reload({stream:true}));
})

gulp.task('scriptsTwo',function(){
    return gulp.src('src/assets/js/**/*.js')
        .pipe(sourcemaps.init())
        .pipe(sourcemaps.write('../maps'))
        .pipe(gulp.dest('./dist/js'))
        .pipe(browserSync.reload({stream:true}));
})

/*--- HTML ---*/
gulp.task('html', function(){
    gulp.src('src/**/*.html')
    .pipe(gulp.dest('./dist'))
    .pipe(gulp.dest('./app'))
    .pipe(browserSync.reload({stream:true}));
})

/* --- Watch Task ---*/
gulp.task ('watch', function(){
	gulp.watch('src/assets/scss/**/*.scss', ['styles','stylesTwo']);
	gulp.watch('src/assets/js/**/*.js', ['scripts','scriptsTwo']);
  	gulp.watch('src/**/*.html', ['html']);
})

/* --- IMAGE TASKS ---*/
gulp.task('images', function() {
  return gulp.src('src/assets/img/**/*.+(png|jpg|jpeg|gif|svg)')
    .pipe(cache(imagemin({
      interlaced: true,
    })))
    .pipe(gulp.dest('./app/images'))
   .pipe(gulp.dest('./dist/images'))
});

/*---- CLEAN TASKS ---*/
gulp.task('clean', function() {
  return del.sync('./app/').then(function(cb) {
    return cache.clearAll(cb);
  });
})
gulp.task('clean:app', function() {
  return del.sync(['./app/**/*', '!./app/images', '!./app/images/**/*']);
});
/*--- BUILD TASKS ---*/
gulp.task('default', function(callback) {
  runSequence(['scriptsTwo', 'stylesTwo', 'html', 'images', 'browserSync', 'watch'],
    callback
  )
})

gulp.task('build', function(callback) {
  runSequence(
    'clean:app',
    ['scripts','styles','html','images'],
    callback
  )
})