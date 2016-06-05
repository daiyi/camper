var co = require('co')
var Nightmare = require('nightmare')
var steps =  require('./steps')
var cloneDeep = require('lodash.clonedeep')
var config = require('./.config.json')
var users = config.users;
var reduce = require('lodash.reduce')
var log = require('./logging.js')
var logutils = require('./logging.utils.js')
var mail = require('./mail');
/*
TOP PRIORITIES FOR TOMORROW
LOGGING
MAIL INDIVIUALS
DEPLOY TO DigitalOcean
*/
// TODO: Create message method
// TODO: Conditional based on weather forcast for given park. If within some threahold (probably 2 weeks)
// For Each Date
// TODO: UI to select dates
// TODO: Don't check dates in the past
// use moment to generate number of days between these two dates
var dates = [
  ['06/10/16','06/12/16'],
  ['06/17/16','06/19/16'],
  // ['06/24/16','06/26/16'],
  // ['07/08/16','07/10/16'],
  // ['07/22/16','07/24/16'],
  // ['07/29/16','07/31/16'],
  // ['08/05/16','08/07/16']
]

var upperPines = {
  name: 'upper-pines',
  contractCode: 'NRSO',
  parkId: 70925,
  siteTypes: [
    2003, // tent
    3100, // tent-only
    9002 // group sites
  ]
}

var northPines = {
  name: 'north-pines',
  contractCode: 'NRSO',
  parkId: 70927,
  siteTypes: [
    2003, // tent
    3100, // tent-only
    9002 // group sites
  ]
}

var lowerPines = {
  name: 'lower-pines',
  contractCode: 'NRSO',
  parkId: 70928,
  siteTypes: [
    2003, // tent
    3100, // tent-only
    9002 // group sites
  ]
}

var siteTypes = [
  2003, // tent
  3100, // tent-only
  9002 // group sites
]

var pointReyes = {
  name: 'point-reyes-national-seashore-campground',
  contractCode: 'NRSO',
  parkId: 72393,
  loop: 104278 // sky
    // 104280, // wildcat
    // 104279 // glen
}

var checkSite = function*(site) {
  var siteTypes = site.siteTypes;
  var dates = site.dates;
  var url = `http://www.recreation.gov/camping/${site.name}/r/campgroundDetails.do?contractCode=${site.contractCode}&parkId=${site.parkId}`;
  log.info(`Starting job ${site.name} and date range ${dates.arrival} - ${dates.departure}`);

  var nightmare = Nightmare({show:true})
  yield nightmare
    .viewport(1440,900)
    .goto(url)
    .catch(logutils.createErrorHandlerFor(`Could not go to ${url}`))
  var numberOfSitesAvailable = 0;
  for (var i = 0; i < siteTypes.length; i++) {
    var siteType = siteTypes[i];
    yield co.wrap(steps.fillOutSearch)(nightmare, site, siteType)
      .catch(logutils.createErrorHandlerFor(`failed filling out search for ${site.name}`, site))
    numberOfSitesAvailable = yield steps.checkAvailable(nightmare)
      .catch(logutils.createErrorHandlerFor(`failed checking site avaialbility ${site.name}`, site))
    if (numberOfSitesAvailable > 0) {
      break;
    }
  }
  if (numberOfSitesAvailable > 0 ) {
    log.info(`Found ${numberOfSitesAvailable} sites for ${site.name} on ${dates.arrival} - ${dates.departure}`)
    var theLuckyFew = users.slice(0, numberOfSitesAvailable - 1);
    var message = `there are sites avaialbe at ${site.name} on ${dates.arrival} - ${dates.departure}, go snag them! ${url}`
    mail.emailUsers(theLuckyFew, message)
    // TODO: e-mail people n-1 people off the stack
    // or text belt perhaps
    // TODO: Figure out how to configure this step based on interested users
    yield nightmare
      .wait('.book.now')
      .click('.book.now')
      .wait('#btnbookdates')
      // TODO: Infer based on arrival and departure dates
      // Decide if this is needed
      .insert('#lengthOfStay')
      .insert('#lengthOfStay',2)
      .click('#btnbookdates')
      .catch(logutils.createErrorHandlerFor(`failed booking site for ${site.name} on ${dates.arrival} - ${dates.departure}`, site))

    var error = yield nightmare
      .wait('#btnbookdates')
      .exists('.msg.error')

    if (error) {
      var errorElements = yield nightmare
        .evaluate(function(){
          var errorEl = document.querySelectorAll('.msg.error')
          return errorEl
        });
      var errorText = reduce(errorElements, function(text, el) {
        return text + ' ' + el.textContent },
      '');
      log.error(`Error ${site.name} booking dates ${site.dates.arrival} - ${site.dates.departure}: ${errorText}`);
    }

    yield steps.login(nightmare, user)
      .catch(logutils.createErrorHandlerFor(`login failed`, user ))
    yield co.wrap(steps.fillOutReservationDetails)(nightmare)
      .catch(logutils.createErrorHandlerFor(`failed to fill out reservation for ${site.name}`))
    if (user[0].pay) {
      yield steps.checkOut(nightmare, users[0].pay);
    }
  }
  yield nightmare.end();
  return numberOfSitesAvailable;
}

// // setInterval(checkAllSites, 60000);

var checkAllSites = function() {
  var allSites = [upperPines, /*lowerPines,*/ northPines];
  var allSitesAndDates = reduce(allSites, function(all, site) {
    var newSites = dates.map(function(date) {
       var dateconfig = { arrival: date[0], departure: date[1] }
       var newSite = cloneDeep(site)
       newSite.dates = dateconfig
       return newSite
    }.bind(this))
    return all.concat(newSites);
  }, [])
  // TODO: Figure out how to only do 4 at a time
  var generators = allSitesAndDates.map(function(site) {
    return co.wrap(checkSite)(site)
      .then(function(result) {
        log.info(`completed workflow for ${site.name} for date range ${site.dates.arrival} - ${site.dates.departure}. ${result} sites found`)
      })
      .catch(function(error) {
        log.error(`Error with side ${site.name} and date range ${site.dates.arrival} - ${site.dates.departure}`, error.stack)
      })
  })
}
// checkAllSites();
var testSite = function(site) {
  site.dates = {
    arrival: '07/29/16',
    departure: '07/31/16'
  }
  co.wrap(checkSite)(site)
    .then(function(result) {
      log.info(`completed workflow for ${site.name} for date range ${site.dates.arrival} - ${site.dates.departure}. ${result} sites found`)
    })
    .catch(function(error) {
      log.error(`Error with side ${site.name} and date range ${site.dates.arrival} - ${site.dates.departure}`, error.stack)
    })
}
testSite(upperPines);
