const { checkAvailability } = require("./check_site");
const login = require("./login");
const bookNow = require("./book_now");
const checkCart = require("./check_cart.js");
const config = require("./../.config.js");
const { sendEmail } = require("./mail");
const { sendText } = require("./twilio");
const log = require("./../logging");

function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
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
async function main() {
  const ids = config.campgroundIds;
  let campgroundId;

  let sites = [];
  for (let i = 0; i < ids.length; i++) {
    campgroundId = ids[i];
    try {
      sites = await checkAvailability(
        campgroundId,
        config.startDate,
        config.endDate
      );
    } catch (e) {
      log.error(`Failed to check  ${campgroundId}`, e);
    }
    if (sites.length) {
      break;
    }
    log.info(`no sites found at ${ids[i]}`);
  }
  if (sites.length > 0) {
    log.info(`found ${sites.length} for ${campgroundId}`, sites);
    if (process.env.NODE_ENV == "dev" && config.notifications.email) {
      const campsiteBaseUrl = `https://www.recreation.gov/camping/campsites/`;
      const message = sites.reduce((str, site) => {
        str += campsiteBaseUrl + site.campsite_id + "\n";
        return str;
      }, "Cancelations on: \n");
      await sendEmail(config.notifications.email, message);
      await sendText(config.notifications.phoneNumber, message);
    }
    try {
      log.debug("Logging in with", config.recreationUser);
      // log in
      const accountDetails = await login(
        config.recreationUser.email,
        config.recreationUser.pass
      );
      // Jitter wait after log in.
      await timeout(Math.random() * 10000);
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
          `Your reservation has been created. Login to recreation.gov and finish checking out. You have 15 minutes`
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
}
log.info(
  `scraper starting for the following dates ${config.startDate} - ${
    config.endDate
  }`
);
main();
setInterval(() => {
  main();
}, 1000 * 60 * 5); // ms * s * m
