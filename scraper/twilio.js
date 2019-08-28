var config = require("./../.config");
var log = require("./../logging");
const util = require("util");
var accountSid = config.twilio.SID; // Your Account SID from www.twilio.com/console
var authToken = config.twilio.authToken; // Your Auth Token from www.twilio.com/console
var twilio = require("twilio");
var client;

if (!!accountSid && !!authToken) {
  client = new twilio(accountSid, authToken);
}

async function sendText(number, message, beeline) {
  let span = beeline.startSpan({
    name: "sendText",
    number,
    message,
    error: null
  });
  if (!!client) {
    const createText = util.promisify(
      client.messages.create.bind(client.messages)
    );
    try {
      const twilioMessage = await createText({
        body: message,
        to: number, // Text this number
        from: config.twilio.twilioNumber // From a valid Twilio number
      });
      span.twilioMessage = twilioMessage;
      beeline.finishSpan(span);

      if (twilioMessage) {
        log.info(twilioMessage.sid);
      }
    } catch (err) {
      span.error = err;
      beeline.finishSpan(span);
      log.error(err);
    }
  }
  span.failed = true;
  beeline.finishSpan(span);
}

module.exports = {
  sendText
};
