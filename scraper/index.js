// load .env vars for dev
if (process.env.NODE_ENV !== "production") {
  const result = require("dotenv").config();
  if (result.error) {
    throw result.error;
  }
}
const config = require("./../.config.js");
const beeline = require("honeycomb-beeline")({
  writeKey: config.honeycombKey,
  dataset: "camper"
});
beeline.customContext.add("env.node_env", process.env.NODE_ENV);

const { checkAvailability } = require("./check_site");
const login = require("./login");
const bookNow = require("./book_now");
const checkCart = require("./check_cart.js");
const { sendEmail } = require("./mail");
const log = require("./../logging");

function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function newTrace() {
  return beeline.startTrace({
    serviceName: "checkjob",
    startDate: config.startDate,
    endDate: config.endDate,
    notifications: config.notifications
  });
}

/**
 * Job
 *   location: Yosemite, Tuolumne
 *   startDate:
 *   endDate:
 *   contactInfo:
 *     name:
 *     email:
 *     phoneNumber:
 *   notify: boolean
 *   checkout: boolean
 */
async function main(trace) {
  const { sendText } = require("./twilio");

  log.info(`checking sites at: ${new Date()}`);
  const ids = config.campgroundIds;
  let campgroundId;
  config.startDate = new Date(config.startDate);
  config.endDate = new Date(config.endDate);

  let sites = [];
  for (let i = 0; i < ids.length; i++) {
    campgroundId = ids[i];
    let span = beeline.startSpan({
      name: "checkCampground",
      campgroundId: campgroundId,
      startDate: config.startDate,
      endDate: config.endDate
    });
    try {
      sites = await checkAvailability(
        campgroundId,
        config.startDate,
        config.endDate
      );
    } catch (e) {
      const errorMsg = `Failed to check  ${campgroundId}`;
      beeline.customContext.add("error", errorMsg);
      beeline.finishSpan(span);
      log.error(errorMsg, e);
    }
    if (sites.length) {
      span.sitesFound = sites.length;
      trace.sitesFound = sites.length;
      beeline.finishSpan(span);
      break;
    }
    log.info(`no sites found at ${ids[i]}`);
    span.sitesFound = sites.length;
    trace.sitesFound = sites.length;
    beeline.finishSpan(span);
  }
  if (sites.length > 0) {
    log.info(`found ${sites.length} for ${campgroundId}`, sites);
    if (process.env.NODE_ENV == "dev" && config.notifications.email) {
      const campsiteBaseUrl = `https://www.recreation.gov/camping/campsites/`;
      const message = sites.reduce((str, site) => {
        str += campsiteBaseUrl + site.campsite_id + "\n";
        return str;
      }, "Cancelations on: \n");
      await sendEmail(config.notifications.email, message, beeline);
      await sendText(config.notifications.phoneNumber, message, beeline);
    }
    try {
      log.debug("Logging in with", config.recreationUser);
      // log in
      const accountDetails = await login(
        config.recreationUser.email,
        config.recreationUser.pass
      );
      // Jitter wait after log in.
      await timeout(Math.random() * 1000 * 60 * 1.5);
      // check cart
      const activeReservations = await checkCart(accountDetails.access_token);
      if (activeReservations.length > 0) {
        log.info("active reservations on account", config.recreationUser.email);
        return;
      }
      // take the first site
      // book site by creating a reservation
      const reservationId = await bookNow(
        accountDetails.access_token,
        accountDetails.account.account_id,
        sites[0].campsite_id,
        campgroundId,
        config.startDate,
        config.endDate
      );

      const reservationURL = `https://www.recreation.gov/camping/reservations/orderdetails?id=${reservationId}`;

      // if not credit card user
      // notify user that it's booked
      if (config.notifications.email) {
        await sendEmail(
          config.notifications.email,
          `You reservation has been create but must be completed. Please log in to recreation.gov and check your cart or log in and follow this link ${reservationURL}`
        );
      }
      if (config.notifications.phoneNumber) {
        await sendText(
          config.notifications.phoneNumber,
          `Your reservation has been created. Login to recreation.gov and finish checking out. You have 15 minutes`,
          beeline
        );
      }
      // else
      // run through the checkout flow.
      // TODO: build checkout flow request
      // update site information
      // post payment information
    } catch (error) {
      log.error(error);
    }
  }
  log.info("no sites found");
  beeline.finishTrace(trace);
}
log.info(
  `scraper starting for the following dates ${config.startDate} - ${config.endDate}`
);
main(newTrace());
setInterval(() => {
  main(newTrace());
}, 1000 * 60 * 5); // ms * s * m
