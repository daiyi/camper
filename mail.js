var wellknown = require('nodemailer-wellknown')
var nodemailer = require('nodemailer')
var config = require('./.config.json')
var log = require('./logging')
var transporter = nodemailer.createTransport({
     service: 'Zoho', // <- resolved as 'Postmark' from the wellknown info
     auth: {
       'user': config.mailer.address,
       'pass': config.mailer.p
     }
})
transporter.verify(function(error, success) {
   if (error) {
     log.error(error);
     process.exit(1);
   } else {
     log.info('Server is ready to take messages');
   }
})

var mailUser = function(user, message) {
  var mailOptions = {
    from: '"Campsite Camper" <no-reply@kwyn.io>', // sender address
    to: user.email, // list of receivers
    subject: 'Site Avaialbe! ⛺', // Subject line
    text: message, // plaintext body
  }
  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      log.error(`failed to send mail to ${user.email}`, error)
    }
    log.info(`succesfully sent mail to ${user.email}`, info)
  })
}
var mailUsers = function(users, message) {
  users.forEach(function(user){
    mailUser(user, message)
  })
}

module.export = {
  mailUsers: mailUsers,
  mailUser: mailUser
}
