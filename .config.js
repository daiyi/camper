// use environmental variables in `.env` file on local dev.
const config = {
  mailer: {
    service: "zoho",
    port: 465,
    secure: true,
    auth: {
      user: process.env.MAILER_USER,
      pass: process.env.MAILER_PASS
    }
  },
  twilio: {
    SID: process.env.TWILIO_SID,
    authToken: process.env.TWILIO_AUTH,
    twilioNumber: process.env.TWILIO_NUMBER
  },
  recreationUser: {
    email: process.env.REC_USER,
    pass: process.env.REC_AUTH
  },
  notifications: {
    phoneNumber: process.env.NOTIFICATION_PHONE,
    email: process.env.NOTIFICATION_EMAIL
  },
  startDate: "2019-09-20",
  endDate: "2019-09-22",
  card: {
    fname: "",
    lname: "",
    number: "",
    code: "",
    expm: "",
    expy: ""
  },
  campgroundIds: [
    232449, // valley
    232450, // valley
    232447, // valley
    232448 // tuolumne
  ],
  honeycombKey: process.env.HONEYCOMB_KEY
};

module.exports = config;
