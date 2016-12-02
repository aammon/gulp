var gulp = require('gulp');
var argv = require('yargs').argv;
var gulpIf = require('gulp-if');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var csscomb = require('gulp-csscomb');
var cssnano = require('gulp-cssnano');
var bourbon = require('node-bourbon').includePaths;
var neat = require('node-neat').includePaths;
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var del = require('del');
var rename = require('gulp-rename');
var nunjucksRender = require('gulp-nunjucks-render');
var data = require('gulp-data');
var htmlreplace = require('gulp-html-replace');
var runSequence = require('run-sequence');
var sizereport = require('gulp-sizereport');
var htmlmin = require('gulp-html-minifier');

gulp.task('browserSync', function(){
    browserSync({
        server: {
            baseDir: 'dist'
        },
        browser: "google chrome"
    });
});
/* --- STYLE TASKS--- */
gulp.task('styles',function(){
    return gulp.src('app/assets/scss/**/*.scss')
    .pipe(sourcemaps.init())
        .pipe(sass({
            includePaths: bourbon,
            includePaths: neat
        }))
        .pipe(csscomb(csscomb.json))
        .pipe(autoprefixer({
            browsers: ['last 3 versions'],
            cascade: false
	    }))
        .pipe(gulpIf(argv.production, rename({suffix:'.min'})))
        .pipe(gulpIf(argv.production, cssnano()))
        .pipe(gulpIf(argv.production, sizereport({
            gzip: true
        })))
    .pipe(sourcemaps.write('../maps'))
    .pipe(gulp.dest('dist/assets/css'))
    .pipe(browserSync.reload({stream:true}));
});
/*--- SCRIPT TASKS ---*/
gulp.task('scripts',function(){
    return gulp.src('app/assets/js/**/*.js')
        .pipe(sourcemaps.init())
            .pipe(gulpIf(argv.production, uglify()))
            .pipe(gulpIf(argv.production, sizereport({ gzip: true })))
            .pipe(gulpIf(argv.production, rename({suffix:'.min'})))
        .pipe(sourcemaps.write('../maps'))
        .pipe(gulp.dest('dist/assets/js'))
        .pipe(browserSync.reload({stream:true}));
});
/*--- HTML ---*/
gulp.task('nunjucks', function () {
    return gulp.src('app/pages/**/*.+(html|nunjucks)')
        .pipe(data(function () {
            return require('./app/data/data.json');
        }))
        .pipe(nunjucksRender({
            path: ['app/templates']
        }))
        .pipe(gulpIf(argv.production, htmlreplace({
        'css': './assets/css/app.min.css',
        'js': 'js/main.min.js'
    })))
        .pipe(gulpIf(argv.production, htmlmin({collapseWhitespace: true})))
        .pipe(gulp.dest('dist'))
        .pipe(browserSync.reload({
            stream: true
        }));
});
/* --- Watch Task ---*/
gulp.task ('watch', function(){
	gulp.watch('app/assets/scss/**/*.scss', ['styles']);
	gulp.watch('app/assets/js/**/*.js', ['scripts']);
  	gulp.watch('app/**/*.nunjucks', ['nunjucks']);
    gulp.watch('app/assets/img/*', ['images']);
});

/* --- IMAGE TASKS ---*/
gulp.task('images', function() {
  return gulp.src('app/assets/img/**/*.+(png|jpg|jpeg|gif|svg)')
    .pipe(cache(imagemin({
      interlaced: true,
      progressive: true
    })))
   .pipe(gulp.dest('./dist/assets/img'))
});
/* --- Font Tasks --- */    
gulp.task('fonts', function () {
    return gulp.src('app/assets/fonts/**/*')
        .pipe(gulp.dest('dist/assets/fonts'))
        .pipe(browserSync.reload({
            stream: true
        }));
});    
/*---- CLEAN TASKS ---*/
gulp.task('clean', function() {
  return del.sync('dist').then(function(cb) {
    return cache.clearAll(cb);
  });
});
gulp.task('clean:dist', function () {
    return del.sync(['dist/**/*', '!dist/images', '!dist/images/**/*']);
});
/*--- BUILD TASKS ---*/
gulp.task('default', function(cb) {
  runSequence('clean:dist', 
              ['scripts', 'styles', 'nunjucks', 'images', 'fonts', 'browserSync', 'watch'], cb )
});
