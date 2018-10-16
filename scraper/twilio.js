var config = require("./../.config");
var log = require("./../logging");
const util = require("util");

var accountSid = config.twilio.SID; // Your Account SID from www.twilio.com/console
var authToken = config.twilio.authToken; // Your Auth Token from www.twilio.com/console

var twilio = require("twilio");
var client = new twilio(accountSid, authToken);

async function sendText(number, message) {
  const createText = util.promisify(
    client.messages.create.bind(client.messages)
  );
  try {
    const twilioMessage = await createText({
      body: message,
      to: number, // Text this number
      from: config.twilio.twilioNumber // From a valid Twilio number
    });

    if (twilioMessage) {
      log.info(twilioMessage.sid);
    }
  } catch (err) {
    log.error(err);
  }
}

module.exports = {
  sendText
};
