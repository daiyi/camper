var co = require('co');
var Nightmare = require('nightmare');
var steps =  require('./steps');
var upperpines = 'http://www.recreation.gov/camping/upper-pines/r/campgroundDetails.do?contractCode=NRSO&parkId=70925'
var cloneDeep = require('lodash.clonedeep')
var reduce = require('lodash.reduce')
// TODO: Create message method
// TODO: Conditional based on weather forcast for given park. If within some threahold (probably 2 weeks)
// For Each Date
// TODO: UI to select dates
// TODO: Don't check dates in the past
var dates = [
  ['06/10/16','06/12/16'],
  ['06/17/16','06/19/16'],
  ['06/24/16','06/26/16'],
  ['07/08/16','07/10/16'],
  ['07/22/16','07/24/16'],
  ['07/29/16','07/31/16'],
  ['08/05/16','08/07/16']
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

  var nightmare = Nightmare()
// TODO: Set a loop to generate these values
  var options = {
    arrival: dates.arrival,
    departure: dates.departure
  }
  var url = `http://www.recreation.gov/camping/${site.name}/r/campgroundDetails.do?contractCode=${site.contractCode}&parkId=${site.parkId}`;
  yield nightmare
    .viewport(1440,900)
    .goto(url)
  var numberOfSitesAvailable = 0;
  for (var j = 0; j < dates.length; i++) {
    for (var i = 0; i < siteTypes.length; i++) {
      options.siteType = siteTypes[i];
      yield nightmare.wait('#subnav')
      yield co.wrap(steps.fillOutSearch)(nightmare, options)
      numberOfSitesAvailable = yield steps.checkAvailable(nightmare)

      if (numberOfSitesAvailable > 0) {
        break;
      }
    }
  }
    if (numberOfSitesAvailable > 0 ) {
      if (numberOfSitesAvailable > 1) {
        // e-mail people n-1 people off the stack
        // or text belt perhaps
        // `there are sites avaialbe, go snag them! ${url}`
      }
      yield nightmare
        .wait('.book.now')
        .click('.book.now')
        .wait('#btnbookdates')
        // TODO: Infer based on arrival and departure dates
        // Decide if this is needed
        .insert('#lengthOfStay')
        .insert('#lengthOfStay',2)
        .click('#btnbookdates')

      var error = yield nightmare
        .wait('#btnbookdates')
        .exists('.msg.error')

      if (error) {
        console.error('Error booking dates');
      }

      yield steps.login(nightmare)
      yield co.wrap(steps.fillOutReservationDetails)(nightmare)
      yield steps.checkOut(nightmare);
    }
    yield nightmare.end();
    yield Promise.resolve(numberOfSitesAvailable);
}
// // setInterval(checkAllSites, 60000);

var checkAllSites = function() {
  var allSites = [upperPines, lowerPines, northPines];
  var allSitesAndDates = reduce(allSites, function(all, site) {
    var newSites = dates.map(function(date) {
       var dateconfig = { arrival: date[0], departure: date[1] }
       var newSite = cloneDeep(site)
       newSite.dates = dateconfig
       console.log(newSite);
       return newSite
    }.bind(this))
    console.log('new sites', all.length, newSites.length)
    return all.concat(newSites);
  }, [])

  var generators = allSitesAndDates.map(function(site) {
    console.log(`starting workflow for ${site.name} for date range ${site.dates.arrival} - ${site.dates.departure}`)
    return co.wrap(checkSite)(site)
      .then(function(result) {
        console.log(result);
        console.log(`completed workflow for ${site.name} for date range ${site.dates.arrival} - ${site.dates.departure}. ${result} sites found`)
      }).catch(function(error) {
        console.error(`Error with side ${site.name} and date range ${site.dates.arrival} - ${site.dates.departure} ${error}`)
      })
  })
}
checkAllSites();
