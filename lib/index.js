var async = require('async');
var couchr = require('couchr');
var request = require('request');
var through = require('through2');
var template = require('lodash.template');

module.exports = function(config, obj, cb) {
  async.retry({
    times: config.retryTimes || 1,
    interval: config.retryInterval || 100
  }, function (callback) {

    var req_opts = {
      method: 'post',
      uri: config.url
    }
    if (config.urlTemplate) {
      var compiled = template(req_opts.uri)
      req_opts.uri = compiled(obj)
    }
    if (obj._id || config.key) {
      req_opts.method = 'put';
      obj._id = obj._id || obj[ config.key ];
      req_opts.uri = req_opts.uri + '/' + encodeURIComponent(obj._id);
    }
    var update = function(){
      var prev_rev = obj._rev;
      couchr[req_opts.method].call(null, req_opts.uri, obj, function (err, resp) {
        if (err) {
          if (config.swallowErrors) return callback(null, {ok: false, error: err.toString() })
          else return callback(err);
        }

        obj._id = resp.id;
        if (config.prev_rev_field) obj[config.prev_rev_field] = prev_rev;
        obj._rev = resp.rev;
        callback(null, obj);
      })
    }
    if(config.force || config.copy_fields_from_prev_rev) prev(obj, config, update)
    else update()
  }, cb)
}


function prev(obj, config, cb) {
  if (config.copy_fields_from_prev_rev) prev_get(obj, config, cb);
  else prev_head(obj, config, cb)
}

function prev_head(obj, config, cb) {
  var req_opts = {
    method: 'HEAD',
    url: config.url + '/' + encodeURIComponent(obj._id)
  }
  request(req_opts, function(err, resp){
    try{
      if (resp.headers.etag) obj._rev = JSON.parse(resp.headers.etag);
    } catch(e){}
    cb()
  })
}

function prev_get(obj, config, cb) {
  var req_opts = {
    method: 'GET',
    json: true,
    url: config.url + '/' + encodeURIComponent(obj._id)
  }
  var fields = config.copy_fields_from_prev_rev;
  if (! Array.isArray(fields)) {
    fields = config.copy_fields_from_prev_rev.split(',');
  }

  couchr.get(config.url + '/' + encodeURIComponent(obj._id), function(err, doc) {
    if (err) return cb(err);

    obj._rev = doc._rev;
    fields.forEach(function(field){
      obj[field] = doc[field];
    })
    cb()
  })
}
