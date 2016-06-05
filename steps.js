var log = require('./logging')
var logutils = require('./logging.utils')
exports.checkAvailable = function(nightmare) {
  return nightmare
    .wait('#filter')
    .click('#filter')
    .wait('.matchSummary')
    .evaluate(function () {
      var element = document.querySelector('.matchSummary')
      var content = element.textContent
      if (content.length) {
        var match = content.match(/^(\d+)/)
        var parsedCount = parseInt(match[0], 10);
        if (parsedCount === NaN) {
          throw new Error('Could not parse site avaialbility content: "'+ content + '"')
        }
        return parsedCount
      }
      return 0
    })
}

exports.fillOutSearch = function*(nightmare, site, siteType) {
  if (site.loop) {
    yield nightmare
      .select('#loop', options.loop)
  }

  if (site.occupants) {
    yield nightmare
      .insert('#camping_common_3012', options.occupants)
  }

  if (siteType) {
    yield nightmare.select('#lookingFor', siteType)
  }
  yield nightmare
    .wait(1000)
    .insert('#arrivalDate')
    .insert('#arrivalDate', site.dates.arrival)
    .insert('#departureDate')
    .insert('#departureDate', site.dates.departure)
  }

exports.fillOutReservationDetails = function*(nightmare) {
  var maxOccupants = yield nightmare
  // TODO: Make script to auto fill max
    .wait('#numoccupants')
    .evaluate(function() {
      var inputRange = document.querySelector('#occupants .inputRange')
      var text = inputRange.textContent;
      var match = text.match(/max.+?(\d+)/)
      var max = match[1]
      return max
    })
    .catch(function(error) {
      console.error('Error attempting to get max occupants', error);
    })
  if (maxOccupants) {
    yield nightmare.insert('#numoccupants', maxOccupants)
  } else {
    throw new Error('could\'t find max number of occupants')
  }
    // TODO: Figure out better control flow
  var hasVehicleOption = yield nightmare.exists('#numvehicles')
  if (hasVehicleOption) {
    var maxVehicles = yield nightmare
        .evaluate(function() {
          var inputRange = document.querySelectorAll('#occupants .inputRange')
          var text = inputRange[1].textContent
          var match = text.match(/max.+?(\d+)/)
          var max = match[1]
          return max;
        })
     if (maxVehicles) {
       yield nightmare.insert('#numvehicles').insert('#numvehicles', maxVehicles)
     } else {
       // TODO: Log error
       throw new Error('couldn\'t find max number of vehicles')
     }
  }
  yield nightmare
    .wait('#agreement')
    .check('#agreement')
    .click('#continueshop')
}

exports.login = function(nightmare, user) {
  return nightmare
    .wait('#combinedFlowSignInKit_emailGroup_attrs')
    .insert('#combinedFlowSignInKit_emailGroup_attrs input', user.email)
    .wait('#combinedFlowSignInKit_passwrdGroup_attrs')
    .insert('#combinedFlowSignInKit_passwrdGroup_attrs input', user.p)
    .click('#submitForm_submitForm')
}

exports.checkout = function(nightmare, pay) {
  return nightmare.wait('#chkout')
      .click('#chkout')
      .wait('#cardTypeId_1')
      .select('#cardTypeId_1', 'VISA')
      .insert('#cardnum_1', pay.n) // card number
      .insert('#seccode_1', pay.c) // security code
      .insert('#expmonth_1', pay.em)// expiration month
      .insert('#expyear_1', pay.ey) // expiration month
      .insert('#fname_1', pay.firstName)
      .insert('#lname_1', pay.lastName)
      .wait('#ackacc')
      .check('#ackacc')
      .wait('#chkout')
      .click('#chkout')
}
