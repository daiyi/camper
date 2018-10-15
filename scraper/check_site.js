var log = require("../logging");
const fetch = require("node-fetch");

var defaultHeaders = {
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.13; rv:62.0) Gecko/20100101 Firefox/62.0",
  Accept: "application/json, text/plain, */*",
  "Accept-Language": "en-GB,en;q=0.5",
  Referer: "https://www.recreation.gov/camping/campgrounds/232449",
  Pragma: "no-cache",
  "Cache-Control": "no-cache, no-store, must-revalidate",
  Connection: "keep-alive",
  DNT: "1"
};

function leftZeroPad(int) {
  if (int < 10) {
    return `0${int}`;
  }
  return String(int);
}

function dateToTimestampString(date) {
  console.log(date);
  const year = date.getUTCFullYear();
  const month = leftZeroPad(date.getUTCMonth() + 1);
  const day = leftZeroPad(date.getUTCDate());
  return `${year}-${month}-${day}T00:00:00.000Z`;
}

/**
 *
 * @param {*} campgroundId
 * @param {String} startDate timestamp representing start date of reservation windo
 * @param {String} endDate timestamp representing end date of reservation window
 */
function buildRequest(campgroundId, startDate, endDate) {
  encodedStartDate = encodeURIComponent(startDate);
  encodedEndDate = encodeURIComponent(endDate);
  const baseUrl = `https://www.recreation.gov/api/camps/availability/campground/${campgroundId}?start_date=${encodedStartDate}&end_date=${encodedEndDate}`;
  return fetch(baseUrl, { headers: defaultHeaders });
}

/**
 *
 * @param {Object} site site object from recreation.gov response
 * @param {Object} site.availabilities object with search dates timestamps as keys
 *
 */
function isSiteAvailable(site) {
  const dates = Object.keys(site.availabilities).sort();
  for (let i = 0; i < dates.length; i++) {
    const date = dates[i];
    site.availabilities[date];
    if (site.availabilities[date] !== "Available") {
      return false;
    }
  }
  return true;
}

function getUnreservedSites(sites) {
  return Object.keys(sites).reduce((available, siteNumber) => {
    const site = sites[siteNumber];
    if (isSiteAvailable(site)) {
      available.push(site);
    }
    return available;
  }, []);
}

async function checkAvailability(siteId, startDate, endDate) {
  try {
    const response = await buildRequest(
      siteId,
      dateToTimestampString(startDate),
      dateToTimestampString(endDate)
    );
    console.log(response);
    const body = await response.json();
    const unreservedSites = getUnreservedSites(body.campsites);
    return unreservedSites;
  } catch (error) {
    log.error("unexpected error retrieving sites", {
      siteId,
      startDate,
      endDate,
      error: String(error)
    });
  }
}
module.exports = {
  checkAvailability,
  getUnreservedSites,
  isSiteAvailable
};
