// link GULP modules
const gulp = require('gulp');
const {
    parallel,
    src,
    dest,
    series,
    watch
} = require('gulp');
const browserSync = require('browser-sync').create();
const concat = require('gulp-concat');
const babel = require('gulp-babel');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const del = require('del');
const imagemin = require('gulp-imagemin');
const imgCompress = require('imagemin-jpeg-recompress');

//link files
const cssFiles = [
    './src/css/main.css',
    './src/css/media.css'
];
const jsFiles = [
    './src/js/lib.js',
    './src/js/main.js'
];

// Unification task of main.css and media.css files
function styles() {
    return src(cssFiles)
        .pipe(concat('style.css'))
        .pipe(autoprefixer({
            cascade: false
        }))
        .pipe(cleanCSS({
            level: 2
        }))
        .pipe(dest('./build/css'))
        .pipe(browserSync.stream());
}

// Unification task of main.js and lib.js files
function scripts() {
    return src(jsFiles)
        .pipe(concat('common.js'))
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(uglify())
        .pipe(dest('./build/js'))
        .pipe(browserSync.stream());
}

// clean directory "build"
function cleanDir() {
    return del(['build/*'])
}

// Function for watching changes in files
function watchChanges() {
    browserSync.init({
        server: {
            baseDir: "./"
        },
        browser: ["C:\/Program Files\/Internet Explorer\/iexplore.exe", "chrome"]
    });
    watch('./src/css/**/*.css', styles);
    watch('./src/js**/*.js', scripts);
    watch("./*.html").on('change', browserSync.reload);
}

// Function for minify images
function images() {
    return src('./src/images/**/*')
        .pipe(imagemin([
            imgCompress({
                loops: 4,
                min: 70,
                max: 80,
                quality: 'high'
            }),
            imagemin.gifsicle(),
            imagemin.optipng(),
            imagemin.svgo()
        ]))
        .pipe(dest('./build/images'))
}

// Call gulp tasks
// Call function "scripts"
exports.scripts = scripts;
// Call function "styles"
exports.styles = styles;
// Call function "cleanDir"
exports.del = cleanDir;
// Call function "watchChanges"
exports.watch = watchChanges;
// Call function "images"
exports.images = images;

exports.build = series(cleanDir, parallel(scripts, styles, images));
// Unification of all tasks
exports.default = series(
    series(
        cleanDir,
        parallel(
            scripts,
            styles,
            images
        )),
    watchChanges);