#!/bin/bash

rm -rf build dist
mkdir -p dist

babel src -d build
browserify build/index.js --standalone MultivariateNormal > dist/multivariate-normal.js
uglifyjs dist/multivariate-normal.js > dist/multivariate-normal.min.js
