var config = require("./.config");
var log = require("./logging");

var accountSid = config.twilio.SID; // Your Account SID from www.twilio.com/console
var authToken = config.twilio.authToken; // Your Auth Token from www.twilio.com/console

var twilio = require("twilio");
var client = new twilio(accountSid, authToken);

module.exports.text = function(number, message) {
  client.messages.create(
    {
      body: message,
      to: number, // Text this number
      from: config.twilio.twilioNumber // From a valid Twilio number
    },
    function(err, message) {
      if (message) {
        log.info(message.sid);
      }
      if (err) {
        log.error(err);
      }
    }
  );
};
