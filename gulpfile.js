/* jshint ignore:start */
var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var ts = require('gulp-typescript');
var jade = require('gulp-jade');
var runSequence = require('run-sequence').use(gulp);
var clean = require('gulp-clean');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');

var dev = false;
var config = {
	dist: './dist',
	client: {
    assets: ['./client/assets/**/*'],
		ts: ['./client/ts/**/*.ts'],
		scss: ['./client/scss/**/*.scss'],
		jade: ['./client/jade/**/*.jade'],
		dist: './dist/client/',
	},
	server: {
		dist: ['./dist/']
	}
};
gulp.task('serve', ['sass'], function () {
	browserSync.init({
		server: "./dist/client"
	});
  gulp.watch(config.client.assets, ['copy-assets']);
	gulp.watch(config.client.scss, ['sass']);
  gulp.watch(config.client.ts, ['typescript']);
	gulp.watch(config.client.jade, ['templates'] );
});

gulp.task('sass', function () {
	return gulp.src(config.client.scss)
    .pipe(sass())
    .pipe(postcss([autoprefixer({browsers: ['last 1 version']})]))
    .pipe(gulp.dest(config.client.dist + 'css'))
    .pipe(browserSync.stream());
});

gulp.task('templates', function () {
	gulp.src(config.client.jade)
  .pipe(jade({pretty: dev}))
  .pipe(gulp.dest(config.client.dist))
  .pipe(browserSync.stream());
});

gulp.task('typescript', function () {
	var tsResult = gulp.src(config.client.ts)
  .pipe(sourcemaps.init())
  .pipe(ts({
		noImplicitAny: true,
		out: 'bundle.js'
	}));
	return tsResult.js
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(config.client.dist + 'js'))
    .pipe(browserSync.stream());
});

gulp.task('clean', function () {
	return gulp.src(config.dist).pipe(clean());
});

gulp.task('dev', function (cb) {
	dev = true;
	runSequence('default', cb);
});

gulp.task('copy-assets', function() {
  return gulp.src(config.client.assets).
        pipe(gulp.dest(config.client.dist + 'assests'))
        .pipe(browserSync.stream());
})

gulp.task('default', function (cb) {
	runSequence('clean', ['copy-assets', 'templates', 'typescript', 'sass'], 'serve', cb);
});
