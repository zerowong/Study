const { src, dest, watch } = require('gulp')
const babel = require('gulp-babel')
const concat = require('gulp-concat')

function build() {
  return src('app/*.jsx', { sourcemaps: true })
    .pipe(babel({ presets: ['@babel/env', '@babel/react'] }))
    .pipe(concat('all.js'))
    .pipe(dest('dist', { sourcemaps: '.' }))
}

// watch('app/**.jsx', build)

exports.default = build
