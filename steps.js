exports.checkAvailable = function(nightmare) {
  return nightmare
    .wait('#filter')
    .click('#filter')
    .wait('.matchSummary')
    .evaluate(function () {
      var element = document.querySelector('.matchSummary')
      console.log(element)
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

exports.fillOutSearch = function*(nightmare, options) {
  if (options.loop) {
    yield nightmare
      .select('#loop', options.loop)
  }

  if (options.occupants) {
    yield nightmare
      .insert('#camping_common_3012', options.occupants)
  }

  if (options.siteType) {
    yield nightmare.select('#lookingFor', options.siteType)
  }
  yield nightmare
    .wait(1000)
    .insert('#arrivalDate')
    .insert('#arrivalDate', options.arrival)
    .insert('#departureDate')
    .insert('#departureDate', options.departure)
  }

exports.fillOutReservationDetails = function*(nightmare) {
  var maxOccupants = yield nightmare
  // TODO: Make script to auto fill max
    .wait('#numoccupants')
    .evaluate(function() {
      var inputRange = document.querySelector('#occupants .inputRange')
      var text = inputRange.textContent;
      var match = text.match(/max.+?(\d+)/)
      console.log(match);
      var max = match[1]
      console.log('max occupants', max);
      return max
    })
    .catch(function(error) {
      console.error('Error attempting to get max occupants', error);
    })
  if (maxOccupants) {
    yield nightmare.insert('#numoccupants', maxOccupants)
  } else {
    console.log('could\'t find max number of occupants')
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
       console.log('couldn\'t find max number of vehicles')
     }
  }
  yield nightmare
    .wait('#agreement')
    .check('#agreement')
    .click('#continueshop')
}

exports.login = function(nightmare) {
  return nightmare
    .wait('#combinedFlowSignInKit_emailGroup_attrs')
    .insert('#combinedFlowSignInKit_emailGroup_attrs input', '')
    .wait('#combinedFlowSignInKit_passwrdGroup_attrs')
    .insert('#combinedFlowSignInKit_passwrdGroup_attrs input', '')
    .click('#submitForm_submitForm')
}

exports.checkout = function(nightmare) {
  return nightmare.wait('#chkout')
      .click('#chkout')
      .wait('#cardTypeId_1')
      .select('#cardTypeId_1', 'VISA')
      .insert('#cardnum_1', '') // card number
      .insert('#seccode_1', '') // security code
      .insert('#expmonth_1', '') // expiration month
      .insert('#expyear_1', '') // expiration month
      .insert('#fname_1', 'Kwyn')
      .insert('#lname_1', 'Meagher')
      .wait('#ackacc')
      .check('#ackacc')
      .wait('#chkout')
      .click('#chkout')
}
