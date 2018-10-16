const { checkAvailability } = require("./check_site");
const login = require("./login");
const bookNow = require("./book_now");
const config = require("./../.config.js");
const { sendEmail } = require("./mail");
const log = require("./../logging");

const siteIds = {
  Yosemite: [232449, 232450, 232447],
  Tuolumne: [232448]
};

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

  console.log(JSON.stringify(sites, null, 4));
  console.log(sites.length);
  if (sites.length) {
    try {
      // log in
      const accountDetails = await login(
        config.recreationUser.email,
        config.recreationUser.pass
      );
      console.log(accountDetails);
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
        sendEmail(
          config.notifications.email,
          `You reservation has been create but must be completed. Please log in to recreation.gov and check your cart or log in and follow this link ${reservationURL}`
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
}

main();
