var couchr = require('couchr');
var request = require('request');
var through = require('through2');

module.exports = function(config) {
  return through.obj(function(obj, enc, cb){

    var req_opts = {
      method: 'post',
      uri: config.url
    }

    if (obj._id || config.key) {
      req_opts.method = 'put';
      obj._id = obj._id || obj[ config.key ];
      req_opts.uri = config.url + '/' + obj._id;
    }

    var update = function(){
      var prev_rev = obj._rev;
      couchr[req_opts.method].call(null, req_opts.uri, obj, function(err, resp){
        if (err) return cb(err);

        obj._id = resp.id;
        if (config.prev_rev_field) obj[config.prev_rev_field] = prev_rev;
        obj._rev = resp.rev;
        cb(null, obj);
      })
    }
    if(config.force) get_prev_rev(obj, config, update)
    else update()

  })
}


function get_prev_rev(obj, config, cb) {
  var req_opts = {
    method: 'HEAD',
    url: config.url + '/' + obj._id
  }
  request(req_opts, function(err, resp){
    try{
      if (resp.headers.etag) obj._rev = JSON.parse(resp.headers.etag);

    } catch(e){}
    cb()
  })

}
