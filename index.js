var co = require('co');
var Nightmare = require('nightmare');
var steps =  require('./steps');
var upperpines = 'http://www.recreation.gov/camping/upper-pines/r/campgroundDetails.do?contractCode=NRSO&parkId=70925'

// TODO: Create message method
// TODO: Conditional based on weather forcast for given park. If within some threahold (probably 2 weeks)
// For Each Date
var dates = [
  ['06/10/16','06/12/16'],
  ['06/17/16','06/19/16'],
  ['06/24/16','06/26/16'],
  ['07/08/16','07/10/16'],
  ['07/08/16','07/10/16'],
  ['07/22/16','07/24/16'],
  ['07/29/16','07/31/16'],
  ['08/05/16','07/07/16'],
]
var upperPines = {
  name: 'upper-pines',
  contractCode: 'NRSO',
  parkId: 70925
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
  var nightmare = Nightmare({
    openDevTools: true,
    show: true
  })
// TODO: Set a loop to generate these values
  var options = {
    arrival: 'Mon Jul 18 2016',
    departure: 'Thu Jul 21 2016'
  }
  var url = `http://www.recreation.gov/camping/${site.name}/r/campgroundDetails.do?contractCode=${site.contractCode}&parkId=${site.parkId}`;
  yield nightmare
    .viewport(1440,900)
    .goto(url)
  var numberOfSitesAvialbe = 0;
  for (var i = 0; i < siteTypes.length; i++) {
    options.siteType = siteTypes[i];
    yield co.wrap(steps.fillOutSearch)(nightmare, options)
    numberOfSitesAvialbe = yield steps.checkAvailable(nightmare)
    if (numberOfSitesAvialbe > 0) {
      break;
    }
  }
    console.log('number of sites', numberOfSitesAvialbe);
    if (numberOfSitesAvialbe > 0 ) {
      if (numberOfSitesAvialbe > 1) {
        // e-mail people n-1 people off the stack
        // or text belt perhaps
        // `there are sites avaialbe, go snag them! ${url}`
      }
      yield nightmare
        .click('.book.next')
        .wait('#btnbookdates')
        // TODO: Infer based on arrival and departure dates
        // Decide if this is needed
        // .insert('#lengthOfStay')
        // .insert('#lengthOfStay',2)
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
      yield nightmare.end();
    }
}
// setInterval(checkAllSites, 60000);
co.wrap(checkSite)(pointReyes)
  .then(function(result){
    console.log('co result', result);
  }, function(error) {
    console.error('co error', error);
  });
// Check each site
  // for each loop
// var branch = function(cond, path1, path2) {
//   return function *(next) {
//     next = (utils.isGenerator(next)) ? next :
//       (function *(nextCo) { yield nextCo; }).call(this);
//     return yield cond.call(this,
//       path1.call(this, next),
//       path2.call(this, next));
//   };
// };
