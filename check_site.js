var co = require('co')
var Nightmare = require('nightmare')
var steps =  require('./steps')
var cloneDeep = require('lodash.clonedeep')
var job = require('./job_config.js')
var users = job.users;
var config = require('./.config.json');
var reduce = require('lodash.reduce')
var log = require('./logging.js')
var logutils = require('./logging.utils.js')
var mail = require('./mail');

module.exports = function*(site) {
  var siteTypes = site.siteTypes;
  var dates = site.dates;
  var url = `http://www.recreation.gov/camping/${site.name}/r/campgroundDetails.do?contractCode=${site.contractCode}&parkId=${site.parkId}`;
  log.info(`Starting job ${site.name} and date range ${site.dates.arrival} - ${site.dates.departure}`);

  var nightmare = Nightmare({ show: config.debug });
  yield nightmare
    .viewport(1440,900)
    .goto(url)
    .catch(logutils.createErrorHandlerFor(`Could not go to ${url}`))
  var numberOfSitesAvailable = 0;
  for (var i = 0; i < siteTypes.length; i++) {
    var siteType = siteTypes[i];
    // TODO: DRY this up
    if (site.loops) {
      for (var j = 0; j < site.loops.length; j++ ) {
        yield co.wrap(steps.fillOutSearch)(nightmare, site, siteType, loops[j])
          .catch(logutils.createErrorHandlerFor(`failed filling out search for ${site.name}`, site))
        numberOfSitesAvailable = yield steps.checkAvailable(nightmare)
          .catch(logutils.createErrorHandlerFor(`failed checking site avaialbility ${site.name}`, site))
        if (numberOfSitesAvailable > 0) {
          break;
        }
      }
    } else {
      yield co.wrap(steps.fillOutSearch)(nightmare, site, siteType)
        .catch(logutils.createErrorHandlerFor(`failed filling out search for ${site.name}`, site))
      numberOfSitesAvailable = yield steps.checkAvailable(nightmare)
        .catch(logutils.createErrorHandlerFor(`failed checking site avaialbility ${site.name}`, site))
    }
    if (numberOfSitesAvailable > 0) {
      break;
    }
  }
  if (numberOfSitesAvailable > 0 ) {
    var siteUrl = yield steps.getSiteUrl(nightmare);
    log.info(`Found ${numberOfSitesAvailable} sites for ${site.name} on ${site.dates.arrival} - ${site.dates.departure}`)
    site.sitesAvaiable = numberOfSitesAvailable;
    site.siteUrl = siteUrl;
    return [nightmare, site]
  }
  return [nightmare, false];
}
