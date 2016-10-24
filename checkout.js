var co = require('co');
var reduce = require('lodash.reduce');
var log = require('./logging');
var logutils = require('./logging.utils');
var config = require('./.config.json');
var moment = require('moment');
var steps = require('./steps')
var mail = require('./mail')
module.exports = function*(nightmare, site) {
  var dates = site.dates;
  var a = moment(dates.arrival, "MM/DD/YYYY");
  var b = moment(dates.departure, "MM/DD/YYYY");
  var lengthOfStay = b.diff(a, 'days');
  yield nightmare
    .wait('.book.now')
    .click('.book.now')
    .wait('#btnbookdates')
    // TODO: Infer based on arrival and departure dates
    // Decide if this is needed
    .insert('#lengthOfStay')
    .insert('#lengthOfStay',lengthOfStay)
    .click('#btnbookdates')
    .catch(logutils.createErrorHandlerFor(`failed booking site for ${site.name} on ${dates.arrival} - ${dates.departure}`, site))

  var error = yield nightmare
    .wait('#btnbookdates')
    .exists('.msg.error')

  if (error) {
    var errorElements = yield nightmare
      .evaluate(function(){
        var errorEl = document.querySelectorAll('.msg.error');
        return errorEl;
      });
    var errorText = reduce(errorElements, function(text, el) {
      return text + ' ' + el.textContent },
    '');
    log.error(`Error ${site.name} booking dates ${site.dates.arrival} - ${site.dates.departure}: ${errorText}`);
  }
  var user = config.recreationUser;
  var card = config.card;
  yield steps.login(nightmare, user)
    .catch(logutils.createErrorHandlerFor(`login failed`, user ))
  yield co.wrap(steps.fillOutReservationDetails)(nightmare, site.equipment)
    .catch(logutils.createErrorHandlerFor(`failed to fill out reservation for ${site.name}`))
  var checkoutStatus = yield steps.checkout(nightmare, card);
  if (!checkoutStatus) {
    mail.sendEmail("kwyn.meagher+debug@gmail.com", "Checkout failed, check error logs")
  }
  yield nightmare
    .wait(1000)
    .exists('.success')
}
