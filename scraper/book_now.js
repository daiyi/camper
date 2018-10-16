const fetch = require("node-fetch");
/**
 * Creates a booking and creates a reservation id
 *
 * @param {*} access_token
 * @param {*} account_id
 * @param {*} campsite_id
 * @param {Date} startDate JS date object
 * @param {Date} endDate JS date object
 * @returns returns the reservation id
 */
module.exports = async function bookNow(
  access_token,
  account_id,
  campsite_id,
  campgroundId,
  startDate,
  endDate
) {
  const bearerTokenHeader = `Bearer ${access_token}`;
  const requestBody = JSON.stringify({
    account_id: account_id,
    campsite_id: campsite_id,
    check_in: startDate.toISOString(),
    check_out: endDate.toISOString()
  });
  console.log(bearerTokenHeader);
  console.log(requestBody);
  const response = await fetch(
    `https://www.recreation.gov/api/camps/reservations`,
    {
      method: "POST",
      headers: {
        authorization: bearerTokenHeader,
        Accept: "application/json, text/plain, */*",
        "Content-Type": " application/json;charset=utf8"
        // Host: "www.recreation.gov",
        // Referer: `https://www.recreation.gov/camping/campgrounds/${campgroundId}/campsites`
      },
      body: requestBody
    }
  );
  // if (!response.ok) {
  //   throw new Error(
  //     `Recieved error ${response.status}: ${response.statusText}`
  //   );
  // }
  console.log(response);
  const body = await response.json();
  console.log("body", body);
  // extract reservation.reservation_id and return
  return body.reservation.reservation_id;
};

/*
response from reservations endpoint POST
{
  "reservation": {
    "account_id": "52559506",
    "account_info": {
      "email": "self@kwyn.io",
      "first_name": "Kwyn",
      "last_name": "Meagher",
      "phone": "",
      "zip": ""
    },
    "campsite_id": "606",
    "campsite_loop": "LOOP2",
    "campsite_name": "212",
    "created_by": "52559506",
    "created_date": "2018-10-15T04:04:49.786926358Z",
    "end_date": "2018-10-31T00:00:00Z",
    "extra_info": {
      "campsite_type": "STANDARD NONELECTRIC",
      "check_in_time": "12:00 PM",
      "check_out_time": "12:00 PM",
      "img_url": "",
      "location": "NORTH PINES",
      "location_id": "70927",
      "recarea": "NPS",
      "type_of_use": "Overnight"
    },
    "facility_id": "232449",
    "facility_type": "STANDARD",
    "flags": {
      "GROUP_SITE": false,
      "HAS_PERSON_FEES": false,
      "NON_SITE_SPECIFIC": false,
      "NO_OCCUPANT_CHANGE": true
    },
    "issuance_data": {
      "copy_number": 0
    },
    "line_items": [
      {
        "fee": {
          "amount": "0.00000",
          "attribute": "allAttributes",
          "description": "Camping Clin for Web Reservations",
          "fee_type": 0,
          "sku": "CAMCLIN1004AA"
        },
        "quantity": 1
      },
      {
        "fee": {
          "amount": "26.00000",
          "attribute": "Use",
          "description": "",
          "fee_type": 2,
          "sku": "CAMUSE232449"
        },
        "quantity": 1
      }
    ],
    "nights": [
      "2018-10-30T00:00:00Z"
    ],
    "order_id": "",
    "reservation_id": "9ae4deaf-f678-47b2-b15b-fc9cdf986263",
    "reservation_status": "HOLD",
    "sales_channel": "Web",
    "site_occupant": {
      "num_occupants": 0,
      "num_vehicles": 0,
      "pass": {
        "pass_number": "",
        "pass_type": ""
      },
      "primary_occupant": {
        "email": "self@kwyn.io",
        "first_name": "Kwyn",
        "last_name": "Meagher",
        "phone": "",
        "zip": ""
      }
    },
    "start_date": "2018-10-30T00:00:00Z",
    "status_history": {
      "2018-10-15T04:04:50.317Z": "HOLD"
    },
    "subtotal": "26.00000",
    "total_cost": "26.00000",
    "total_paid": "0.00000",
    "updated_by": "",
    "updated_date": "0001-01-01T00:00:00Z"
  }
}
*/
