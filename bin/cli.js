#!/usr/bin/env node
const ndjson = require('hyper-ndjson')

var config = require('rc')('ndjson-to-couchdb', {
  url: undefined,
  key: undefined,
  force: false,
  swallowErrors: false,
  prev_rev_field: undefined,
  copy_fields_from_prev_rev: undefined,
  urlTemplate: false,
  retryTimes: 1,
  retryInterval: 100,
  concurrency: 1
})

if (!config.url && config._[0]) {
  config.url = config._[0];
}

if (!config.key && config._[1]) {
  config.key = config._[1];
}

const worker = require('../lib/worker')

ndjson(config, process.stdin, process.stdout, worker, function () {
  process.exit()
})
