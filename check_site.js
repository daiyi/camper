var co = require("co");
var Nightmare = require("nightmare");
var steps = require("./steps");
var cloneDeep = require("lodash.clonedeep");
var job = require("./job_config.js");
var users = job.users;
var config = require("./.config");
var reduce = require("lodash.reduce");
var log = require("./logging.js");
var logutils = require("./logging.utils.js");
var request = require("request");

var headers = {
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.13; rv:62.0) Gecko/20100101 Firefox/62.0",
  Accept: "application/json, text/plain, */*",
  "Accept-Language": "en-GB,en;q=0.5",
  Referer: "https://www.recreation.gov/camping/campgrounds/232449",
  Pragma: "no-cache",
  "Cache-Control": "no-cache, no-store, must-revalidate",
  Connection: "keep-alive",
  DNT: "1"
  // Cookie:
  // "_ga=GA1.2.1871576669.1539377527; _gid=GA1.2.463202698.1539377527; _gat_UA-112750441-5=1"
};

var options = {
  url:
    "https://www.recreation.gov/api/camps/availability/campground/232449?start_date=2018-10-27T00%3A00%3A00.000Z&end_date=2018-10-28T00%3A00%3A00.000Z",
  headers: headers
};

function callback(error, response, body) {
  if (!error && response.statusCode == 200) {
    console.log(body);
  }
  console.error(error);
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
    if (site.availabilities[date] === "Reserved") {
      return false;
    }
  }
  return true;
}

/**
 *
 * @param {*} site site config object
 * @returns Array {NigthmareInstance, siteInfo}
 */
module.exports = {
  main: function(site) {
    // var siteTypes = site.siteTypes;
    // var dates = site.dates;
    console.log("testing", options);
    request(options, callback);
  },
  getUnreservedSites: function(sites) {},
  isSiteAvailable
};
