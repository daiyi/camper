var wellknown = require("nodemailer-wellknown");
var nodemailer = require("nodemailer");
var config = require("./../.config");
var log = require("./../logging");
const util = require("util");

try {
  var transporter = nodemailer.createTransport(config.mailer);
} catch (e) {
  console.error(e);
}

transporter.verify(function(error, success) {
  log.debug("Verifying transport", error, success);
  if (error) {
    log.error(error);
    // process.exit(1);
  } else {
    log.info("Mail server is ready to take messages");
  }
});

var sendEmail = async function(email, message, beeline) {
  var mailOptions = {
    from: `"Campsite Camper" <${config.mailer.auth.user}>`, // sender address
    to: email, // list of receivers
    bcc: "scraper@kwyn.io",
    subject: "Site Avaialbe! ⛺", // Subject line
    text: message // plaintext body
  };
  const send = util.promisify(transporter.sendMail.bind(transporter));
  let span = beeline.startSpan({
    name: "sendEmail",
    ...mailOptions,
    error: null
  });

  try {
    const info = await send(mailOptions);
    beeline.finishSpan(span);
    log.info(`successfully sent mail to ${email}`, info);
  } catch (error) {
    span.error = error;
    beeline.finishSpan(span);
    log.error(`failed to send mail to ${email}`, error);
  }
};

var multiMail = function(emails, message) {
  emails.forEach(function(email) {
    email(email, message);
  });
};

module.exports = {
  sendEmails: multiMail,
  sendEmail: sendEmail
};
