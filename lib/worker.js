const run = require('./index.js')

module.exports = function (config, output, obj, cb) {
  run(config, obj, function (err, resp) {
    if (err && config.swallowErrors) {
      output({ok: false, error: err.toString() })
      return cb()
    }
    else if (err) return cb(err)
    output(resp)
    cb()
  })
}
