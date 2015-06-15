#!/usr/bin/env node
var ndjson = require('ndjson');
var through = require('through2');

var config = require('rc')('ndjson-to-couchdb', {
  url: undefined,
  force: false,
  prev_rev_field: undefined
})

if (!config.url && config._[0]) {
  config.url = config._[0];
}

var to_couch = require('../lib');


process.stdin
  .pipe(ndjson.parse())
  .pipe(to_couch(config))
  .pipe(ndjson.stringify())
  .pipe(process.stdout)
