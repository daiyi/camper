
module.exports = function*(site) {
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
  var user = config.recreationUser;
  var card = config.card;
  yield steps.login(nightmare, user)
    .catch(logutils.createErrorHandlerFor(`login failed`, user ))
  yield co.wrap(steps.fillOutReservationDetails)(nightmare)
    .catch(logutils.createErrorHandlerFor(`failed to fill out reservation for ${site.name}`))
  if (user[0].pay) {
    yield steps.checkOut(nightmare, card);
  }
}
