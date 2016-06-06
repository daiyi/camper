var co = require('co')
var Nightmare = require('nightmare')
var steps =  require('./steps')
var cloneDeep = require('lodash.clonedeep')
var reduce = require('lodash.reduce')
var log = require('./logging.js')
var logutils = require('./logging.utils.js')
var mail = require('./mail');
var job = require('./job_config')
/*
TOP PRIORITIES FOR TOMORROW
LOGGING
MAIL INDIVIUALS
DEPLOY TO DigitalOcean
*/
// TODO: Create message method
// TODO: Conditional based on weather forcast for given park. If within some threahold (probably 2 weeks)

var checkSite = require('./check_site.js');

var run = function*(job) {
  var result = yield checkSite(job)
  var nightmare = result[0] // This is always the nightmare object to chain request to
  var job = result[1] // The job object you passed in originally
  if (job) {
    console.log(job)
    log.info(`completed workflow for ${job.name} for date range ${job.dates.arrival} - ${job.dates.departure}. ${job.sitesAvaiable} sites found ${job.siteUrl}`)
    var message = `there are sites avaialbe at ${job.name} on ${job.dates.arrival} - ${job.dates.departure}, go snag them! ${job.siteUrl}`
  } else {
    log.info('failed to find sites')
  }
  // TODO: send this to twilio and mailer
  yield nightmare.end()
}

co
  .wrap(run)(job)
  .catch(function(error) {
     log.info("error checking site", error.stack);
  });

// var testSite = function(site) {
//   site.dates = {
//     arrival: '07/29/16',
//     departure: '07/31/16'
//   }
//   co.wrap(checkSite)(site)
//     .then(function(result) {
//       log.info(`completed workflow for ${site.name} for date range ${site.dates.arrival} - ${site.dates.departure}. ${result} sites found`)
//     })
//     .catch(function(error) {
//       log.error(`Error with side ${site.name} and date range ${site.dates.arrival} - ${site.dates.departure}`, error.stack)
//     })
// }
// testSite(upperPines);
