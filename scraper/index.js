const { checkAvailability } = require("./check_site");
const config = require("./../.config.js");

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
  const job = {
    location: "Yosemite",
    startDate: new Date("2018-10-31"),
    endDate: new Date("2018-11-01"),
    contactInfo: {
      name: "",
      email: "test@kwyn.io",
      phoneNumber: "4086212997"
    }
  };

  const ids = siteIds[job.location];
  let campgroundId;

  let sites = [];
  for (let i = 0; i < ids.length; i++) {
    campgroundId = ids[i];
    try {
      sites = await checkAvailability(campgroundId, job.startDate, job.endDate);
    } catch (e) {
      log.error(`failed to check  ${campgroundId}`, e);
    }
    if (sites.length) {
      break;
    }
    console.log(`no sites found at ${ids[i]}`);
  }
  console.log(JSON.stringify(sites, null, 4));
  console.log(sites.length);
  if (sites.length) {
    // take the first site
  }
}

main();
