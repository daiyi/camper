# Campsite Camper
By default this scraper will only notify you of campsite availability. It can be setup to automate way more though.
## Quick Start

### Setting up a job.
- Create a file name `.config.json` with the parameters found in `.config.example.json`
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
   "twilio": { // Once logged in twillio you can find this info here https://www.twilio.com/console/sms/dashboard
     "SID": "", // Your twilio SID  
     "authToken": "" // Your twillio auth token
   },
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



## Running headless on Debian
Install dependencies
```sh
# Install node
curl -sL https://deb.nodesource.com/setup_4.x | sudo -E bash -
apt-get update
sudo apt-get install -y nodejs
# Install xvfb to run nightmare js headlessly
apt-get install xvfb
```
run command:
```
xvfb-run -a node index.js
```
## File Structure
### index.js
This is the entry point for the scraper. You can set this up to run a function on setInterval or more preferably just install a cron job\* that runs it at whatever frequency you want.
\*. Note that this scraper for one date can take about 15 seconds to run. Electron has a prohibitively long boot up time but gives you the benefit of being able to write really high level scripts.

This is where you decide how you want your scraper to run.
check_site.
