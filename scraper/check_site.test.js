const { isSiteAvailable, getUnreservedSites } = require("./check_site");

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
const noDaysAvailableSite = function(siteNumber) {
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

describe.only("isSiteAvailable", () => {
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
    const test = noDaysAvailableSite("103");
    expect(isSiteAvailable(test)).toBe(false);
  });
  test("When availability object is empty", () => {
    let test = noDaysAvailableSite("104");
    test.availabilities = {};
    console.log(test);
    expect(isSiteAvailable(test)).toBe(false);
  });
});

describe("getUnreservedSites", () => {
  describe("when there is one site", () => {
    it("should return the one available site number", () => {
      const testSites = {
        "101": allDaysAvailableSite("101"),
        "102": someDaysAvailableSite("102"),
        "103": noDaysAvailableSite("103")
      };
      expect(getUnreservedSites(testSites)).toEqual(["101"]);
    });
  });
  describe("When there are multiple sites", () => {
    it("should return all avaialable site numbers", () => {
      const testSites = {
        "101": allDaysAvailableSite("101"),
        "102": someDaysAvailableSite("102"),
        "103": noDaysAvailableSite("103"),
        "104": allDaysAvailableSite("104")
      };
      expect(getUnreservedSites(testSites)).toEqual(["101", "104"]);
    });
  });
  describe("When there are no sites", () => {
    it("should return an empty array", () => {
      const testSites = {
        "101": noDaysAvailableSite("101"),
        "102": someDaysAvailableSite("102"),
        "103": noDaysAvailableSite("103")
      };
      expect(getUnreservedSites(testSites)).toEqual([]);
    });
  });
});
