#!/bin/bash

rm -rf build dist
mkdir -p dist

babel src -d build
browserify build/index.browserify.js > dist/multivariate-normal.js
uglifyjs dist/multivariate-normal.js > dist/multivariate-normal.min.js
