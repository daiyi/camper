var co = require('co')
var Nightmare = require('nightmare')
var steps =  require('./steps')
var cloneDeep = require('lodash.clonedeep')
var reduce = require('lodash.reduce')
var log = require('./logging.js')
var logutils = require('./logging.utils.js')
var mail = require('./mail');
var jobs = require('./job_config')
var twilio = require('./twilio');
var config = require('./.config.json')
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
    log.info(`completed workflow for ${job.name} for date range ${job.dates.arrival} - ${job.dates.departure}. ${job.sitesAvaiable} sites found ${job.siteUrl}`)
    var message = `there are sites avaialbe! ✨ at ${job.name} on ${job.dates.arrival} - ${job.dates.departure}, go snag them! ${job.siteUrl}`
    // twilio.text(config.notification.text, message);
    mail.sendEmail(config.notification.email, message)
  } else {
    log.info('failed to find sites')
  }
  yield nightmare.end()
  var nextJob = jobs.pop();
  if (nextJob) {
    co.wrap(run)(nextJob)
      .catch(function(error) {
         log.info("error checking site", error.stack);
      });
  }
};

var job = jobs.pop();
co
  .wrap(run)(job)
  .catch(function(error) {
     log.info("error checking site", error.stack);
  });
