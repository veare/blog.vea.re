// Imports
const gulp = require('gulp')
const fs = require('fs')
const chalk = require('chalk')
const gutil = require('gulp-util')
// var rename = require('gulp-rename')
const rev = require('gulp-rev')
const del = require('del')
const postcss = require('gulp-postcss')
const concat = require('gulp-concat')
const uglify = require('gulp-uglify')
const refresh = require('gulp-refresh')
const nodemon = require('gulp-nodemon')
// var svgmin = require('gulp-svgmin')
// var svgstore = require('gulp-svgstore')
// var cheerio = require('gulp-cheerio')
const sourcemaps = require('gulp-sourcemaps')
const runSequence = require('run-sequence')
const size = require('gulp-size')
const mustache = require('gulp-mustache')
// var filenames = require('gulp-filenames')
const tap = require('gulp-tap')
const path = require('path')
const babel = require('gulp-babel')

function swallowError (error) {
  // If you want details of the error in the console
  console.log(error.toString())
  this.emit('end')
}

function reportSavings (sizes, prefix) {
  let decrease = Math.floor(((sizes.before.size - sizes.after.size) / sizes.before.size * 100))
  gutil.log(prefix + ' ' + chalk.white.bgGreen.bold(` ${decrease}% saved `) + ` Total size ${sizes.after.prettySize} / ` + chalk.green.bold(`${sizes.gzip.prettySize} (gzip)`))
}
/* ------------------------------
 *
 * JS
 *
 */
gulp.task('clean-js', function () {
  return del([
    'public/js'
  ])
})

gulp.task('build-js', function (done) {
  let files = {
    common: [
      'resources/js/analytics.js',
      'resources/js/app.js',
      'node_modules/page-sections/dist/page-sections.js'
    ],
    portfolio: [
      'node_modules/minigrid/dist/minigrid.min.js',
      'resources/js/cards.js'
    ],
    'registerServiceWorker': [
      'resources/js/register-service-worker.js'
    ]
  }
  let moveFiles = [
    'node_modules/@webcomponents/webcomponentsjs/webcomponents-loader.js',
    'node_modules/@webcomponents/webcomponentsjs/webcomponents-hi-sd-ce.js',
    'node_modules/@webcomponents/webcomponentsjs/webcomponents-hi-ce.js',
    'node_modules/@webcomponents/webcomponentsjs/webcomponents-hi.js',
    'node_modules/@webcomponents/webcomponentsjs/webcomponents-lite.js',
    'node_modules/@webcomponents/webcomponentsjs/webcomponents-sd-ce.js',
    'node_modules/@webcomponents/webcomponentsjs/webcomponents-hi-sd-ce.js.map',
    'node_modules/@webcomponents/webcomponentsjs/webcomponents-hi-ce.js.map',
    'node_modules/@webcomponents/webcomponentsjs/webcomponents-hi.js.map',
    'node_modules/@webcomponents/webcomponentsjs/webcomponents-lite.js.map',
    'node_modules/@webcomponents/webcomponentsjs/webcomponents-sd-ce.js.map'
  ]
  // MOVE files
  gulp.src(moveFiles)
    .pipe(gulp.dest('public/js'))
  // BUILD JS
  Object.keys(files).forEach(function (key) {
    const sizes = {
      'before': size({showTotal: false}),
      'after': size({showTotal: false}),
      'gzip': size({
        showTotal: false,
        gzip: true
      })
    }
    gulp.src(files[key])
        .pipe(sourcemaps.init())
        .pipe(babel({
          presets: [ [ 'es2015', { modules: false } ] ],
          plugins: ['transform-custom-element-classes']
        }))
        .on('error', swallowError)
        .pipe(concat(key + '.js'))
        .pipe(sizes.before)
        .pipe(uglify())
        .pipe(sizes.after)
        .pipe(sizes.gzip)
        .pipe(sourcemaps.write('/'))
        .pipe(gulp.dest('public/js'))
        .on('end', function () {
          reportSavings(sizes, 'JS (' + key + '):')
        })
  })
  done()
})
// js
gulp.task('js', function (done) {
  runSequence(
        'clean-js',
        'build-js',
        'rev',
        'html',
        done
    )
})
// watch js
gulp.task('watch-js', function () {
  gulp.watch([
    'resources/js/*'
  ], ['js'])
})
/* ------------------------------
 *
 * POST CSS
 *
 */
gulp.task('clean-css', function (done) {
  return del([
    'public/css'
  ])
})

gulp.task('build-css', function () {
  const sizes = {
    'before': size({showTotal: false}),
    'after': size({showTotal: false}),
    'gzip': size({
      gzip: true,
      showTotal: false
    })
  }
  return gulp.src([
    // npm resources
    'node_modules/minireset.css/minireset.css',
    'node_modules/open-color/open-color.css',
    'node_modules/flex-layout-attribute/css/flex-layout-attribute.css',
    'node_modules/modular-scale-css/modular-scale.css',
    // includes
    'resources/css/includes/*.css',
    // main files
    'resources/css/*.css',
    'resources/css/pages/*.css'
  ])
        .pipe(sourcemaps.init())
        .pipe(concat('app.css'))
        .pipe(sizes.before)
        .pipe(postcss([
          require('postcss-will-change'),
          require('postcss-discard-comments'),
          require('postcss-cssnext')({
            browsers: ['last 2 versions'],
            features: {
              rem: false
            }
          }),
          require('postcss-round-subpixels'),
          require('cssnano')({
            autoprefixer: false,
            discardComments: {
              removeAll: true
            }
            // zindex: false
          }),
          require('postcss-reporter')({
            plugins: [
              'postcss-color-function'
            ]
          })
        ]))
        .pipe(sizes.after)
        .pipe(sizes.gzip)
        .pipe(sourcemaps.write('/'))
        .pipe(gulp.dest('public/css'))
        .on('end', function () {
          reportSavings(sizes, 'CSS:')
        })
})
// css
gulp.task('css', function (done) {
  runSequence(
        'clean-css',
        'build-css',
        'rev',
        'html',
        done
    )
})
// watch css
gulp.task('watch-css', function () {
  gulp.watch([
    'resources/css/*',
    'resources/css/**/*'
  ], ['css'])
})
/* ------------------------------
 *
 * HTML
 *
 */
gulp.task('html', function () {
  let json = JSON.parse(fs.readFileSync('./resources/templates/data/portfolio.json'))
  json.css = {}
  json.js = {}
    // get files
  return gulp.src([
    'public/css/*-*.css',
    'public/js/*-*.js'
  ], {read: false})
    .pipe(tap(function (file) {
      let filename = path.basename(file.path)
      let [name, ext] = filename.split('.')
      json[ext][name.split('-').shift()] = '/' + ext + '/' + filename
    }))
    .on('end', function () {
      gulp.src(['resources/templates/*.mustache', 'resources/templates/**/*.mustache', '!resources/templates/partials/*.mustache'])
        .pipe(mustache(json, {
          extension: '.html'
        }))
        .on('error', console.log)
        .pipe(gulp.dest('public'))
        .pipe(refresh())
    })
})
// watch css
gulp.task('watch-html', function () {
  gulp.watch([
    'resources/templates/*',
    'resources/templates/**/*'
  ], ['html'])
})
/* ------------------------------
 *
 * Revision
 *
 */
gulp.task('rev', function (done) {
  // delete old files in a snycronus manor
  if (fs.existsSync('public/rev-manifest.json')) {
    var manifest = fs.readFileSync('public/rev-manifest.json', 'utf8')
    del.sync(Object.values(JSON.parse(manifest)), {'cwd': 'public/'})
  }

  return gulp.src([
    'public/css/app.css',
    'public/js/*.js'
        // 'public/svgs/svg-sprite.svg'
  ], {base: 'public'})
        .pipe(rev())
        .pipe(gulp.dest('public'))
        .pipe(rev.manifest({
          merge: true // merge with the existing manifest (if one exists)
        }))
        .pipe(gulp.dest('public'))
})
/* ------------------------------
 *
 * service-worker
 *
 */
gulp.task('service-worker', function (done) {
  let swPrecache = require('sw-precache')
  let rootDir = 'public'
  let fileHashes = {}
  // urls to prefetch
  let urlsToPrefetch = [
    '/media/veare-icons@2x.png',
    '/media/lukas-oppermann@2x.png',
    '/css/app.css',
    'https://fonts.googleapis.com/css?family=Source+Sans+Pro:400,600,Noto+Serif:400i'
  ]

  // get revisioned file version if exists in manifest
  if (fs.existsSync(rootDir + '/rev-manifests.json')) {
    let manifest = fs.readFileSync(rootDir + '/rev-manifest.json', 'utf8')
    fileHashes = JSON.parse(manifest)
  }
  // replace url with revisioned url in urlsToPrefetch
  urlsToPrefetch = urlsToPrefetch.map(function (item) {
    if (item.substring(0, 4) === 'http') {
      return item
    }

    let key = item.replace(/^\//g, '')

    if (typeof fileHashes[key] !== 'undefined') {
      return rootDir + '/' + fileHashes[key]
    }
    return rootDir + '/' + item
  })
  // create service worker
  swPrecache.write(`${rootDir}/service-worker.js`, {
    staticFileGlobs: urlsToPrefetch,
    stripPrefix: rootDir,
    runtimeCaching: [{
      urlPattern: /\.googleapis\.com\//,
      handler: 'cacheFirst'
    }, {
      urlPattern: '/(.*)',
      handler: 'cacheFirst'
    }]
  }, done)
})
/* ------------------------------
 *
 * live reload
 *
 */
gulp.task('serve', function () {
  nodemon({
    script: 'server.js',
    watch: 'server.js',
    delay: '1000'
  })
  .on('start', function () {
    setTimeout(function () {
      refresh()
    }, 2000) // wait for the server to finish loading before restarting the browsers
  })
})
/* ------------------------------
 *
 * default task
 *
 */
gulp.task('default', function (done) {
  refresh.listen()
  runSequence(
    [
      'clean-js',
      'clean-css'
    // 'clean-svg'
    ],
    [
      'build-js',
      'build-css'
    // 'svgsprite'
    ],
    'rev',
    'html',
    'service-worker',
    [
    // 'watch-svg',
      'watch-css',
      'watch-js',
      'watch-html'
    ],
    done
    )
})
