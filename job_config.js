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
  arrival: '10/29/16',
  departure: '10/30/16'
};

var users = {
  name: "kwyn",
  email: "self@kwyn.io"
};
var equipment = "108060";
// FYI for checkout you need to sometimes insert primary equipment for Yosemite
// The codes are as follows:
/*
<select name="equipmentType" id="equip" class="m error" onchange="showEquipmentLenghtOrDepth(this.options[this.selectedIndex].value,&quot;equip_length&quot;, &quot;equip_depth&quot;, &quot;108068;108067;108660;108061;108063;108062&quot;,&quot;&quot;)">
  <option selected="selected" value="-1">-- Select Equipment --</option>
  <option value="108068">Caravan/Camper Van</option>
  <option value="108067">Fifth Wheel</option>
  <option value="108661">Large Tent Over 9X12`</option>
  <option value="108660">Pickup Camper</option>
  <option value="108061">Pop up</option>
  <option value="108063">RV/Motorhome</option>
  <option value="108060">Tent</option>
  <option value="108062">Trailer</option>
</select>
*/
// Map shared info to all sites
var jobs = campsites.map(function(site) {
  site.siteTypes = siteTypes;
  site.dates = dates;
  site.users = users;
  site.equipment = equipment;
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
