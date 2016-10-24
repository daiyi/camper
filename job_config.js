var jobs;

var campsites = [
  {
    name: 'upper-pines',
    contractCode: 'NRSO',
    parkId: 70925
  },
  {
    name: 'north-pines',
    contractCode: 'NRSO',
    parkId: 70927
  },
  {
    name: 'lower-pines',
    contractCode: 'NRSO',
    parkId: 70928
  }
];

var siteTypes = [
  2003, // tent
  3100, // tent-only
  9002 // group sites
];

var dates = {
  arrival: '11/02/16',
  departure: '11/03/16'
};

var users = {
  name: "kwyn",
  email: "self@kwyn.io"
};
// Map shared info to all sites
var jobs = campsites.map(function(site) {
  site.siteTypes = siteTypes;
  site.dates = dates;
  site.users = users;
  return site;
});

// jobs = [{
//     name: 'point-reyes-national-seashore-campground',
//     contractCode: 'NRSO',
//     parkId: 72393,
//     loop: 104278, // sky
//       // 104280, // wildcat
//       // 104279 // glen
//     siteTypes: [
//       2003, // tent
//       3100, // tent-only
//       9002 // group sites
//     ],
//     dates: {
//         arrival: '11/02/16',
//         departure: '11/03/16'
//     },
//     users: {
//       name: "kwyn",
//       email: "self@kwyn.io"
//     }
// }];

module.exports = jobs;
