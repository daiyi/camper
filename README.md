# Campsite Camper
By default this scraper will only notify you of campsite availability. It can be setup to automate way more though.

## Quick Start

### Setting up a job.
- Create a file name `.config.js` with the parameters found in `.config.example.js`
  - Example:
```js
    {
      "mailer" : {
         "service": "", // service
         "auth": {
           "user": "",// your e-mail address or user name
           "pass": ""
         }
       },
       "twilio": { // Once logged in twilio you can find this info here https://www.twilio.com/console/sms/dashboard
         "SID": "", // Your twilio SID  
         "authToken": "", // Your twilio auth token
         "twilioNumber": "" // Your provisioned twilio number
       },
       // Not needed yet as checkout isn't automated.
       "card" : { // CC INFO
         "name": "",
         "number": "",
         "code": "",
         "exp" : ""
       }
    }
```
- the mailer config should mimic the parameters and structures found in the [nodemailer-wellknown documentation](https://github.com/nodemailer/nodemailer-wellknown)
  Note that if your well-known isn't working you can set it up from scratch. Setup found in the  [nodemailer repo](https://github.com/nodemailer/nodemailer)  
- Once configuration is setup run `npm install` within the project to install the dependencies
- To run the scraper run `node scraper/index.js`
- If you want to see dev log output run `NODE_ENV=dev node scraper/index.js` I typically use this on first setup.
- error logs can be found in scraper.error.log, these are structured logs and can be viewed with any structured log viewer.

## develop locally
1. `npm run dev`

## deploy to zeit

1. install `now`: `npm install now -g`
2. run: `now`
3. wait for deploy to finish. then, scale min to 1 so it doesn't freeze: `now scale <build_url> 1`. 
  - for example, `now scale camper-cmkj20htu9.now.sh 3`