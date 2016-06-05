var log = require('./logging')

module.exports.createErrorHandlerFor = function(description, meta){
  return function(error) {
    if (meta) {
      log.error(description, {meta: meta, error: error })
    } else {
      log.error(description, error)
    }
  }
}
