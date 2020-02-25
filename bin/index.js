#! /usr/bin/env node

const path = require('path');
const { run } = require('../lib');

const fromCwd = p => path.join(process.cwd(), p);

const pkg = require(fromCwd('package.json'));

const options = Object.assign({
  ext: '.js',
  root: 'test',
}, pkg['elmer-fudd']);

if (options.alias) {
  for (let a in options.alias) {
    options.alias[a] = fromCwd(options.alias[a]);
  }
}

run({
  ext: options.ext,
  root: fromCwd(options.root),
  alias: options.alias,
});
