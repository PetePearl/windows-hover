var gulp = require('gulp');
var sass = require('gulp-sass');
var runSequence = require('run-sequence');
var sourcemaps = require('gulp-sourcemaps');
var imagemin = require('gulp-imagemin');
var gih = require("gulp-include-html");
var fsync = require('gulp-files-sync');
var browserSync = require('browser-sync');
var clean = require('gulp-clean');
var autoprefixer = require('gulp-autoprefixer');





function log(error) {
    console.log([
        '',
        "----------ERROR MESSAGE START----------".bold.red.underline,
        ("[" + error.name + " in " + error.plugin + "]").red.bold.inverse,
        error.message,
        "----------ERROR MESSAGE END----------".bold.red.underline,
        ''
    ].join('\n'));
}

//---------------------------------------------------------- cleaner

gulp.task('cleaner', function() {
    return gulp.src('dist')
        .pipe(clean({force: true}))
});

//---------------------------------------------------------- browser-sync

gulp.task('browsersync', function () {
    browserSync({
        server: {
            baseDir: 'dist'
        },
        notify: false
    })
});


//---------------------------------------------------------- html

//build-html
gulp.task('build-html', function () {
    return gulp.src("./src/**/*.html")
        .pipe(gih({
            'public': "/dist/",
            baseDir: './src/components/'
        })).pipe(gulp.dest("./dist/"));
});

//watch-html
gulp.task('watch-html', function () {
    gulp.watch('src/**/*.html', function () {
        runSequence('build-html', function () {
            browserSync.reload();
        });
    });
});


//---------------------------------------------------------- scss

//build-scss
gulp.task('build-scss', function () {
    return gulp.src('src/scss/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 version', 'safari >= 5', 'firefox >= 20', 'ie >= 9', 'opera >= 12', 'ios >= 6', 'android >= 4'],
            cascade: false
        })).on('error', log)
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('dist/css/'));
});

//watch-scss
gulp.task('watch-scss', function () {
    gulp.watch('src/scss/*.scss', function () {
        runSequence('build-scss', function () {
            browserSync.reload();
        });
    });
});


//---------------------------------------------------------- images

//build-images
gulp.task('build-images', function () {
    return gulp.src('src/images/**/*.*')
        .pipe(gulp.dest('dist/images'))
});

//build-images & optimize
gulp.task('build-images-optimize', function () {
    return gulp.src('src/images/**/*.*')
    .pipe(imagemin()).on('error', log)
        .pipe(gulp.dest('dist/images'))
});

//watch-images
gulp.task('watch-images', function () {
    gulp.watch('src/images/**/*.*', function (event, cb) {
        runSequence('build-images', function () {
            browserSync.reload();
        })
    });
});

//build-letters
gulp.task('build-letters', function () {
    return gulp.src('src/letters/**/*.*')
        .pipe(gulp.dest('dist/letters'))
});


//---------------------------------------------------------- fonts

//build-fonts
gulp.task('build-fonts', function () {
    return gulp.src('src/fonts/**/*.*')
        .pipe(gulp.dest('dist/fonts/'))
});

//watch-fonts
gulp.task('watch-fonts', function () {
    gulp.watch('src/fonts/**/*.*', function (event, cb) {
        runSequence('build-fonts', function () {
            browserSync.reload();
        })
    });
});


//---------------------------------------------------------- scripts

//build-js
gulp.task('build-js', function () {
    return gulp.src('src/js/**/*.js')
        .pipe(gulp.dest('dist/js'))
});

//watch-js
gulp.task('watch-js', function () {
    gulp.watch('src/js/**/*.js', function (event, cb) {
        runSequence('build-js', function () {
            browserSync.reload();
        })
    });
});

//---------------------------------------------------------- sync
gulp.task('sync', function() {
    fsync(['src/**', 'dist/**'], 'dist').end();
});


gulp.task('dev', function () {
    runSequence(
        'cleaner',

        'build-html',
        'watch-html',

        'build-scss',
        'watch-scss',

        'build-images',
        //'build-images-optimize',
        'watch-images',

        'build-fonts',
        'watch-fonts',

        'build-js',
        'watch-js',

        'build-letters',

        'browsersync'
    )
});

gulp.task('default', ['dev']);




