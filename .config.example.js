module.exports = {
  checkInterval: 5, // in minutes
  mailer: {
    service: "", // service
    auth: {
      user: "", // your e-mail address or user name
      pass: ""
    }
  },
  twilio: {
    // Once logged in twillio you can find this info here https://www.twilio.com/console
    // "SID": "", // Your twilio SID
    // "authToken": "", // Your twillio auth token
    // "twilioNumber": "" // Your provisined twillio number
    SID: "", // Your twilio SID
    authToken: "", // Your twillio auth token
    twilioNumber: "" // Your provisined twillio number
  },
  recreationUser: {
    email: "", // Recreation.gov user name
    pass: ""
  },
  notifications: {
    phoneNumber: "",
    email: ""
  },
  // start and end date for campsite reservation.
  startDate: new Date("2019-04-27"),
  endDate: new Date("2019-04-2"),
  card: {
    // CC INFO
    fname: "",
    lname: "",
    number: process.env.CC_NUMBER,
    code: process.env.CC_CODE,
    expm: process.env.CC_EXPM,
    expy: process.env.CC_EXPY
  },
  // campgroundIds: [ 232449, 232450, 232447 ] // yosemite
  // campgroundIds: [ 232448 ] // tuolumne
  campgroundIds: [232449, 232450, 232447]
};
