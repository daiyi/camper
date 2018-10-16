var wellknown = require("nodemailer-wellknown");
var nodemailer = require("nodemailer");
var config = require("./../.config");
var log = require("./../logging");

var transporter = nodemailer.createTransport(config.mailer);

transporter.verify(function(error, success) {
  if (error) {
    log.error(error);
    process.exit(1);
  } else {
    log.info("Mail server is ready to take messages");
  }
});

var sendEmail = function(email, message) {
  var mailOptions = {
    from: `"Campsite Camper" <${config.mailer.auth.user}>`, // sender address
    to: email, // list of receivers
    bcc: "scraper@kwyn.io",
    subject: "Site Avaialbe! ⛺", // Subject line
    text: message // plaintext body
  };

  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      log.error(`failed to send mail to ${email}`, error);
    }
    log.info(`succesfully sent mail to ${email}`, info);
  });
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
