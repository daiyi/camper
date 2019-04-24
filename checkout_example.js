// THIS IS OLD CODE I'M KEEPING AROUND AS AN EXAMPLE
var co = require("co");
var Nightmare = require("nightmare");
var cloneDeep = require("lodash.clonedeep");
var reduce = require("lodash.reduce");
var log = require("./logging.js");
var logutils = require("./logging.utils.js");
var mail = require("./mail");
var twilio = require("./twilio");
var config = require("./.config.json");
var jobs = require("./job_config");

/*
TOP PRIORITIES FOR TOMORROW
LOGGING
MAIL INDIVIUALS
DEPLOY TO DigitalOcean
*/
// TODO: Create message method
// TODO: Conditional based on weather forcast for given park. If within some threahold (probably 2 weeks)

var checkSite = require("./check_site.js");
var checkout = require("./checkout.js");

var run = function*(job) {
  var result = yield checkSite(job);
  var nightmare = result[0]; // This is always the nightmare object to chain request to
  var job = result[1]; // The job object you passed in originally
  var checkout_success = false;
  if (job) {
    log.info(
      `completed workflow for ${job.name} for date range ${
        job.dates.arrival
      } - ${job.dates.departure}. ${job.sitesAvaiable} sites found ${
        job.siteUrl
      }`
    );
    var message = `there are sites avaialbe! ✨ at ${job.name} on ${
      job.dates.arrival
    } - ${job.dates.departure}, go snag them! ${job.siteUrl}`;
    // twilio.text(config.notification.text, message);
    // mail.sendEmail(config.notification.email, message)
    checkout_success = yield checkout(nightmare, job);
  } else {
    log.info("failed to find sites");
  }

  yield nightmare.end();
  var nextJob = jobs.pop();
  if (nextJob && !checkout_success) {
    co.wrap(run)(nextJob).catch(function(error) {
      console.log(error.stack);
      log.info("error checking site", error.stack);
    });
  }
};

var job = jobs.pop();
co.wrap(run)(job).catch(function(error) {
  log.info("error checking site", error.stack);
});
