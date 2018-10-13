const { isSiteAvailable, getAvailableSites } = require("./check_site");

/**
 *
 * @param {String} siteNumber string representing the site number
 */
const allDaysAvailableSite = function(siteNumber) {
  return {
    availabilities: {
      "2018-10-30T00:00:00Z": "Available",
      "2018-10-31T00:00:00Z": "Available"
    },
    campsite_id: "579",
    campsite_reserve_type: "Site-Specific",
    loop: "LOOP1",
    quantities: null,
    site: siteNumber
  };
};

/**
 *
 * @param {String} siteNumber string representing the site number
 */
const someDaysAvailableSite = function(siteNumber) {
  return {
    availabilities: {
      "2018-10-31T00:00:00Z": "Available",
      "2018-10-30T00:00:00Z": "Reserved"
    },
    campsite_id: "579",
    campsite_reserve_type: "Site-Specific",
    loop: "LOOP1",
    quantities: null,
    site: siteNumber
  };
};

/**
 *
 * @param {String} siteNumber string representing the site number
 */
const noDaysAvailable = function(siteNumber) {
  return {
    availabilities: {
      "2018-10-30T00:00:00Z": "Reserved",
      "2018-10-31T00:00:00Z": "Reserved"
    },
    campsite_id: "579",
    campsite_reserve_type: "Site-Specific",
    loop: "LOOP1",
    quantities: null,
    site: siteNumber
  };
};

describe("isSiteAvailable", () => {
  describe("when all days are available", () => {
    it("returns true", () => {
      const test = allDaysAvailableSite("101");
      expect(isSiteAvailable(test)).toBe(true);
    });
  });
  test("when only one day is available", () => {
    const test = someDaysAvailableSite("102");
    expect(isSiteAvailable(test)).toBe(false);
  });
  test("when no days are available", () => {
    const test = noDaysAvailable("103");
    expect(isSiteAvailable(test)).toBe(false);
  });
});
